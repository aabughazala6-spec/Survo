// CRS (Coordinate Reference System) Engine - Pure Logic
// Handles coordinate transformations and projections

export interface CRSDefinition {
  code: string;
  name: string;
  datum: string;
  projection: string;
  units: 'meters' | 'feet' | 'us-feet';
  epsg?: number;
}

export interface Coordinate {
  northing: number;
  easting: number;
  elevation?: number;
}

// Common CRS definitions
export const COMMON_CRS: Record<string, CRSDefinition> = {
  'EPSG:4326': {
    code: 'EPSG:4326',
    name: 'WGS 84',
    datum: 'WGS84',
    projection: 'Lat/Lon',
    units: 'meters',
    epsg: 4326,
  },
  'EPSG:3857': {
    code: 'EPSG:3857',
    name: 'Web Mercator',
    datum: 'WGS84',
    projection: 'Mercator',
    units: 'meters',
    epsg: 3857,
  },
  'EPSG:27700': {
    code: 'EPSG:27700',
    name: 'British National Grid',
    datum: 'OSGB36',
    projection: 'Transverse Mercator',
    units: 'meters',
    epsg: 27700,
  },
};

/**
 * Get CRS definition by code
 */
export function getCRS(code: string): CRSDefinition | undefined {
  return COMMON_CRS[code];
}

/**
 * Validate CRS code
 */
export function isValidCRS(code: string): boolean {
  return code in COMMON_CRS || /^EPSG:\d+$/.test(code);
}

/**
 * Convert units from meters to target unit
 */
export function convertUnits(
  value: number,
  fromUnit: 'meters' | 'feet' | 'us-feet',
  toUnit: 'meters' | 'feet' | 'us-feet'
): number {
  if (fromUnit === toUnit) {
    return value;
  }

  // Convert to meters first
  let inMeters: number;
  switch (fromUnit) {
    case 'feet':
      inMeters = value * 0.3048;
      break;
    case 'us-feet':
      inMeters = value * 0.3048006096012192;
      break;
    default:
      inMeters = value;
  }

  // Convert from meters to target
  switch (toUnit) {
    case 'feet':
      return inMeters / 0.3048;
    case 'us-feet':
      return inMeters / 0.3048006096012192;
    default:
      return inMeters;
  }
}

/**
 * Scale coordinates based on CRS units
 */
export function scaleToCRS(
  coord: Coordinate,
  targetCRS: CRSDefinition
): Coordinate {
  const scaledNorthing = convertUnits(coord.northing, 'meters', targetCRS.units);
  const scaledEasting = convertUnits(coord.easting, 'meters', targetCRS.units);
  
  return {
    northing: scaledNorthing,
    easting: scaledEasting,
    elevation: coord.elevation,
  };
}
