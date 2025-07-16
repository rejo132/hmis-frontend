// Correct JavaScript format (not JSON)
module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/"
  ],
  testEnvironment: "jsdom"
};