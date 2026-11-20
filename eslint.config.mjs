import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['.next/**/*', 'node_modules/**/*', 'dist/**/*'],
  },
  firebaseRulesPlugin.configs['flat/recommended'],
];
