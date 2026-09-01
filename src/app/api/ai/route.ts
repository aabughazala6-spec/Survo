import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Strict Zod Schema for input validation
const AIRequestSchema = z.object({
  prompt: z.string().min(1).max(5000),
  datasetId: z.string().uuid(),
  projectId: z.string().uuid(),
});

// Simple in-memory rate limiter (MVP - upgrade to Redis in P3)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '10', 10);
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count += 1;
  rateLimitMap.set(identifier, record);
  return true;
}

function detectPromptInjection(prompt: string): boolean {
  const injectionPatterns = [
    /ignore\s+(previous|all)\s+(instructions|rules)/i,
    /bypass\s+(security|restrictions)/i,
    /act\s+as\s+(admin|system|developer)/i,
    /reveal\s+(secret|key|password)/i,
    /execute\s+(command|code)/i,
  ];
  return injectionPatterns.some((pattern) => pattern.test(prompt));
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body. JSON expected.' },
        { status: 400 }
      );
    }

    const validation = AIRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request format. Please check your input.' },
        { status: 400 }
      );
    }

    const { prompt, datasetId, projectId } = validation.data;

    // Prompt injection detection
    if (detectPromptInjection(prompt)) {
      return NextResponse.json(
        { error: 'Request rejected due to security policy violation.' },
        { status: 400 }
      );
    }

    // Verify API key exists (server-side only)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable.' },
        { status: 500 }
      );
    }

    // Mock AI processing (replace with actual AI call in production)
    // In production: const response = await fetch('https://api.openai.com/...', ...)
    const mockResponse = {
      analysis: 'Survey data analysis complete',
      suggestions: ['Verify point coordinates', 'Check CRS consistency'],
      confidence: 0.95,
    };

    return NextResponse.json(
      {
        success: true,
        data: mockResponse,
        meta: {
          projectId,
          datasetId,
          processedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
