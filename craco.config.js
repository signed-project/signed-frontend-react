const path = require('path');

console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!path', path.resolve(__dirname, 'src/'));
console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!path', path.resolve(__dirname, 'src/'));
console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!path', path.resolve(__dirname, 'src/'));
console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!path', path.resolve(__dirname, 'src/'));
console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!path', path.resolve(__dirname, 'src/'));
console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!path', path.resolve(__dirname, 'src/'));

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@(.*)$': '<rootDir>/src$1'
      }
    }
  }
};
