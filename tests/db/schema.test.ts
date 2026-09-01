import { describe, it, expect } from 'vitest';

describe('Database Schema', () => {
  it('schema file exists and exports db', async () => {
    const { db } = await import('@/lib/db/schema');
    expect(db).toBeDefined();
    expect(db.name).toBe('SurveyProDB');
  });

  it('has required tables defined in schema', async () => {
    const { db } = await import('@/lib/db/schema');
    expect(db.tables.map(t => t.name)).toEqual(
      expect.arrayContaining(['projects', 'datasets', 'points', 'tasks'])
    );
  });
});
