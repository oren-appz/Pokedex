module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    plugins: [
      'react',
      '@typescript-eslint',
    ],
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Add this line
      // You can add custom rules here
    },
  };
  