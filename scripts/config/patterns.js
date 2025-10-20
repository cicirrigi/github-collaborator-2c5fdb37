/**
 * 🎯 Vantage Lane 2.0 - Regex Patterns Configuration
 * Centralized patterns for AI Guardian Ultimate v5.0
 */

// 🚨 CRITICAL ERROR PATTERNS
const criticalPatterns = [
  { p: /:\s*any\b/, msg: 'TypeScript any type found', type: 'error' },
  { p: /console\.log/, msg: 'Console statement found', type: 'error' },
  { p: /localhost|127\.0\.0\.1/, msg: 'Localhost reference found', type: 'error' },
  { p: /api[_-]?key|secret|token/i, msg: 'Potential sensitive key found', type: 'error' },
  { p: /process\.env\.[A-Z_]+/g, msg: 'Environment variable in frontend code', type: 'error' }
]

// ⚠️ WARNING PATTERNS
const warningPatterns = [
  { p: /#[0-9A-Fa-f]{6}/, msg: 'Hardcoded hex color found', type: 'warning' },
  { p: /TODO|FIXME|HACK|XXX/gi, msg: 'Unresolved development comment', type: 'warning' },
  { p: /style\s*=\s*\{\{/, msg: 'Inline style detected', type: 'warning' },
  { p: /font-family\s*:/, msg: 'Direct font-family usage (use design tokens)', type: 'warning' },
  { p: /\b\d+(px|rem|em)\b/, msg: 'Magic number spacing (use design tokens)', type: 'warning' }
]

// 🏆 VANTAGE LANE SPECIFIC PATTERNS
const vantageLanePatterns = [
  { p: /Vantage Lane|Premium|Luxury/gi, msg: 'Hardcoded brand text found', type: 'warning' },
  { p: /copyright\s+\d{4}/gi, msg: 'Hardcoded copyright year (use dynamic)', type: 'warning' },
  { p: /@example\.com|test@test\.com/gi, msg: 'Placeholder email found', type: 'warning' },
  { p: /SELECT\s+\*\s+FROM/gi, msg: 'SQL SELECT * detected', type: 'warning' },
  { p: /\.bind\(this\)/, msg: 'Old-style binding (use arrow functions)', type: 'info' }
]

// 🧩 COMPONENT PATTERN VALIDATION
const componentPatterns = [
  { p: /export\s+default\s+function\s+[a-z]/, msg: 'Component should start with uppercase', type: 'error' },
  { p: /interface\s+[a-z]/, msg: 'Interface should start with uppercase', type: 'error' },
  { p: /type\s+[a-z]/, msg: 'Type should start with uppercase', type: 'error' }
]

// 📁 FILE NAMING PATTERNS
const fileNamingPatterns = [
  { p: /\.jsx$/, msg: 'Use .tsx extension for React components', type: 'error' },
  { p: /\.js$/, msg: 'Use .ts extension for TypeScript files', type: 'warning' },
  { p: /[A-Z][a-zA-Z]*\.tsx$/, msg: 'Component files should use PascalCase', type: 'info' }
]

// 🚀 PERFORMANCE PATTERNS
const performancePatterns = [
  { p: /import\s+\*\s+as/, msg: 'Avoid namespace imports (impacts tree-shaking)', type: 'warning' },
  { p: /useEffect\(\(\)\s*=>\s*\{/, msg: 'Consider useCallback for effect dependencies', type: 'info' },
  { p: /new\s+Date\(\)(?!\.\w+)/, msg: 'Consider using date utilities for consistency', type: 'info' }
]

// 📏 SIZE AND COMPLEXITY LIMITS
const fileSizeLimits = {
  '.tsx': 200,    // UI Components
  '.ts': 250,     // Logic files  
  '.js': 400,     // Scripts (exception)
  '.md': 400,     // Documentation
  '.json': 100,   // Config files
  '.css': 300     // Style files
}

// 🚫 EXCLUDED DIRECTORIES
const excludeDirectories = [
  'node_modules', 'dist', 'coverage', '.next', 'build', '.git', 
  'logs', '.vscode', '.DS_Store', '.turbo', '.vercel'
]

// 🚫 EXCLUDED FILES  
const excludeFiles = [
  '.test.ts', '.spec.ts', '.d.ts', '.tsbuildinfo', '.log',
  '.map', '.lock', '.cache', '.tmp'
]

module.exports = {
  criticalPatterns,
  warningPatterns, 
  vantageLanePatterns,
  componentPatterns,
  fileNamingPatterns,
  performancePatterns,
  fileSizeLimits,
  excludeDirectories,
  excludeFiles
}
