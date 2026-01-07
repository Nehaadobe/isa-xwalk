/**
 * Stats Block Parser
 * Parses clinical trial statistics comparisons
 */

export function parseStatsBlock(slideElement, document) {
  // Look for stats data in the slide
  // Pharma slides often have embedded data or image-based stats
  const statsContainer = slideElement.querySelector('.stats, [data-stats]');

  // For image-based pharma slides, we need to extract from image OCR or manual mapping
  // This parser provides structure for manual content entry

  const block = {
    name: 'Stats',
    rows: [],
  };

  // Default structure for clinical trial comparison
  // Content should be populated during import review
  block.rows = [
    ['Treatment', 'Value', 'CI'],
    ['Comparator', 'Value', 'CI'],
    ['Hazard Ratio / P-value'],
  ];

  return block;
}

/**
 * Parse survival statistics from structured data
 */
export function parseSurvivalStats(data) {
  if (!data) return null;

  return {
    treatment: {
      label: data.treatmentLabel || 'Treatment',
      value: data.treatmentValue || '',
      ci: data.treatmentCI || '',
    },
    comparator: {
      label: data.comparatorLabel || 'Comparator',
      value: data.comparatorValue || '',
      ci: data.comparatorCI || '',
    },
    hazardRatio: data.hr || '',
    pValue: data.pValue || '',
  };
}
