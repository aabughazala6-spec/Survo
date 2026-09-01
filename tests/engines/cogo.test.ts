import { describe, it, expect } from 'vitest';
import { calculateDistance, calculateBearing, bearingToDegrees } from '@/lib/engines/cogo';

describe('COGO Engine', () => {
  it('calculates distance between two points', () => {
    const p1 = { northing: 0, easting: 0 };
    const p2 = { northing: 3, easting: 4 };
    expect(calculateDistance(p1, p2)).toBe(5);
  });

  it('calculates bearing correctly', () => {
    const p1 = { northing: 0, easting: 0 };
    const p2 = { northing: 1, easting: 0 };
    const bearing = calculateBearing(p1, p2);
    expect(bearingToDegrees(bearing)).toBeCloseTo(0, 0);
  });
});
