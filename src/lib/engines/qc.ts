// QC (Quality Control) Engine - Pure Logic
// Validates survey data integrity

export interface PointData {
  id: string;
  name: string;
  northing: number;
  easting: number;
  elevation?: number;
  code?: string;
}

export interface QCResult {
  passed: boolean;
  errors: QCIssue[];
  warnings: QCIssue[];
}

export interface QCIssue {
  type: 'error' | 'warning';
  code: string;
  message: string;
  pointId?: string;
  field?: string;
}

// QC Rule codes
export const QC_RULES = {
  DUPLICATE_NAME: 'QC001',
  MISSING_COORDINATES: 'QC002',
  INVALID_COORDINATES: 'QC003',
  OUT_OF_BOUNDS: 'QC004',
  DUPLICATE_ID: 'QC005',
  EMPTY_NAME: 'QC006',
} as const;

/**
 * Check for duplicate point names
 */
export function checkDuplicateNames(points: PointData[]): QCIssue[] {
  const issues: QCIssue[] = [];
  const nameMap = new Map<string, string[]>();

  points.forEach((point) => {
    const existing = nameMap.get(point.name);
    if (existing) {
      existing.push(point.id);
    } else {
      nameMap.set(point.name, [point.id]);
    }
  });

  nameMap.forEach((ids, name) => {
    if (ids.length > 1) {
      issues.push({
        type: 'error',
        code: QC_RULES.DUPLICATE_NAME,
        message: `Duplicate point name: "${name}"`,
        field: 'name',
      });
    }
  });

  return issues;
}

/**
 * Check for missing or invalid coordinates
 */
export function checkCoordinates(points: PointData[]): QCIssue[] {
  const issues: QCIssue[] = [];

  points.forEach((point) => {
    if (
      point.northing === undefined ||
      point.northing === null ||
      isNaN(point.northing)
    ) {
      issues.push({
        type: 'error',
        code: QC_RULES.MISSING_COORDINATES,
        message: `Missing northing for point "${point.name}"`,
        pointId: point.id,
        field: 'northing',
      });
    }

    if (
      point.easting === undefined ||
      point.easting === null ||
      isNaN(point.easting)
    ) {
      issues.push({
        type: 'error',
        code: QC_RULES.MISSING_COORDINATES,
        message: `Missing easting for point "${point.name}"`,
        pointId: point.id,
        field: 'easting',
      });
    }
  });

  return issues;
}

/**
 * Check for out-of-bounds coordinates
 */
export function checkBounds(
  points: PointData[],
  bounds: {
    minNorthing: number;
    maxNorthing: number;
    minEasting: number;
    maxEasting: number;
  }
): QCIssue[] {
  const issues: QCIssue[] = [];

  points.forEach((point) => {
    if (
      point.northing < bounds.minNorthing ||
      point.northing > bounds.maxNorthing
    ) {
      issues.push({
        type: 'warning',
        code: QC_RULES.OUT_OF_BOUNDS,
        message: `Point "${point.name}" northing out of bounds`,
        pointId: point.id,
        field: 'northing',
      });
    }

    if (
      point.easting < bounds.minEasting ||
      point.easting > bounds.maxEasting
    ) {
      issues.push({
        type: 'warning',
        code: QC_RULES.OUT_OF_BOUNDS,
        message: `Point "${point.name}" easting out of bounds`,
        pointId: point.id,
        field: 'easting',
      });
    }
  });

  return issues;
}

/**
 * Check for empty point names
 */
export function checkEmptyNames(points: PointData[]): QCIssue[] {
  const issues: QCIssue[] = [];

  points.forEach((point) => {
    if (!point.name || point.name.trim() === '') {
      issues.push({
        type: 'error',
        code: QC_RULES.EMPTY_NAME,
        message: `Empty point name for ID "${point.id}"`,
        pointId: point.id,
        field: 'name',
      });
    }
  });

  return issues;
}

/**
 * Run full QC validation on a set of points
 */
export function runQC(
  points: PointData[],
  bounds?: {
    minNorthing: number;
    maxNorthing: number;
    minEasting: number;
    maxEasting: number;
  }
): QCResult {
  const errors: QCIssue[] = [];
  const warnings: QCIssue[] = [];

  // Run all checks
  errors.push(...checkDuplicateNames(points).filter((i) => i.type === 'error'));
  errors.push(...checkCoordinates(points));
  errors.push(...checkEmptyNames(points));

  if (bounds) {
    warnings.push(...checkBounds(points, bounds));
  }

  return {
    passed: errors.length === 0,
    errors,
    warnings,
  };
}
