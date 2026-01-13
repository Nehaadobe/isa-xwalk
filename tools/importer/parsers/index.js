/**
 * SKI ISA Block Parsers Index
 * Re-exports all parsers for convenient importing
 */

export { extractBrandInfo, extractISILines, createHeroBlock } from './hero-parser.js';
export { extractIndications, createIndicationsBlock } from './indications-parser.js';
export { extractCoverage, createCoverageBlock } from './coverage-parser.js';
export { extractSupport, createSupportBlock } from './support-parser.js';
export { extractNavigation, createNavBlock } from './nav-parser.js';

// Import default exports for grouped access
import heroParser from './hero-parser.js';
import indicationsParser from './indications-parser.js';
import coverageParser from './coverage-parser.js';
import supportParser from './support-parser.js';
import navParser from './nav-parser.js';

// Default export with all parsers grouped
export default {
  hero: heroParser,
  indications: indicationsParser,
  coverage: coverageParser,
  support: supportParser,
  nav: navParser,
};
