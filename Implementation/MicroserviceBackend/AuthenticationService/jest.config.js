export const preset = "ts-jest";
export const testEnvironment = "node";
export const rootDir = "./";
export const testMatch = ["**/?(*.)+(spec|test).[tj]s?(x)"];
export const collectCoverage = true;
export const collectCoverageFrom = [
  "src/**/*.{ts,tsx}", // <-- include all TS/TSX files under /src
  "!src/**/*.d.ts", // <-- ignore type declaration files
  "!src/**/__tests__/**", // <-- ignore test folders if you have any inside src
  "!src/**/index.ts", // <-- optional: ignore index.ts entry points
  "!src/config/**", // <-- optional: ignore config files
];
export const testPathIgnorePatterns = ['/dist'];
