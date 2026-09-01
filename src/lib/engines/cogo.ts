// COGO (Coordinate Geometry) Engine - Pure Logic
// No UI, no side effects - pure functions only

export interface Coordinate {
  northing: number;
  easting: number;
}

export interface Point2D {
  id: string;
  name: string;
  coordinate: Coordinate;
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(p1: Coordinate, p2: Coordinate): number {
  const dn = p2.northing - p1.northing;
  const de = p2.easting - p1.easting;
  return Math.sqrt(dn * dn + de * de);
}

/**
 * Calculate bearing from point 1 to point 2 (in radians)
 */
export function calculateBearing(p1: Coordinate, p2: Coordinate): number {
  const dn = p2.northing - p1.northing;
  const de = p2.easting - p1.easting;
  return Math.atan2(de, dn);
}

/**
 * Calculate bearing in degrees (0-360)
 */
export function bearingToDegrees(bearing: number): number {
  let degrees = (bearing * 180) / Math.PI;
  if (degrees < 0) {
    degrees += 360;
  }
  return degrees;
}

/**
 * Calculate new point given start point, distance, and bearing
 */
export function calculatePoint(
  startPoint: Coordinate,
  distance: number,
  bearingRadians: number
): Coordinate {
  return {
    northing: startPoint.northing + distance * Math.cos(bearingRadians),
    easting: startPoint.easting + distance * Math.sin(bearingRadians),
  };
}

/**
 * Calculate area of a polygon using Shoelace formula
 */
export function calculatePolygonArea(points: Coordinate[]): number {
  if (points.length < 3) {
    return 0;
  }
  
  let area = 0;
  const n = points.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i].easting * points[j].northing;
    area -= points[j].easting * points[i].northing;
  }
  
  return Math.abs(area) / 2;
}
