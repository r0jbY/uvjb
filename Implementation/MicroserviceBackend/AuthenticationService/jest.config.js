module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./",
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",       // <-- include all TS/TSX files under /src
    "!src/**/*.d.ts",          // <-- ignore type declaration files
    "!src/**/__tests__/**",    // <-- ignore test folders if you have any inside src
    "!src/**/index.ts",        // <-- optional: ignore index.ts entry points
    "!src/config/**",          // <-- optional: ignore config files

  ],
};
