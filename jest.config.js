module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  moduleDirectories: ["node_modules"],
  coverageDirectory: "coverage",
  collectCoverage: true,
  collectCoverageFrom: [
    "helpers/**/*.js",
    "utils/**/*.js",
    "services/**/*.js",
    "validations/**/*.js",
    "controllers/**/*.js",
    "routes/**/*.js",
    "!**/app.js",
    "!**/node_modules/**",
  ],
  testMatch: ["**/__tests__/**/*.test.js"],
  coverageReporters: ["json", "lcov", "text", "clover"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFiles: [
    "dotenv/config",
    "module-alias/register",
    "swagger-ui-express",
    "http-errors",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
