import { describe, it, expect } from 'vitest';
import { runQC, QC_RULES } from '@/lib/engines/qc';

describe('QC Engine', () => {
  it('passes valid points', () => {
    const points = [
      { id: '1', name: 'P1', northing: 100, easting: 200 },
      { id: '2', name: 'P2', northing: 150, easting: 250 },
    ];
    const result = runQC(points);
    expect(result.passed).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('detects duplicate names', () => {
    const points = [
      { id: '1', name: 'P1', northing: 100, easting: 200 },
      { id: '2', name: 'P1', northing: 150, easting: 250 },
    ];
    const result = runQC(points);
    expect(result.passed).toBe(false);
    expect(result.errors.some(e => e.code === QC_RULES.DUPLICATE_NAME)).toBe(true);
  });

  it('detects missing coordinates', () => {
    const points = [
      { id: '1', name: 'P1', northing: NaN, easting: 200 },
    ];
    const result = runQC(points);
    expect(result.passed).toBe(false);
    expect(result.errors.some(e => e.code === QC_RULES.MISSING_COORDINATES)).toBe(true);
  });
});
