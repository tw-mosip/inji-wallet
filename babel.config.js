module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript',
      '@babel/preset-react',
      'module:metro-react-native-babel-preset',
    ],
    sourceType: 'module',
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: 'react-native-dotenv',
          path: '.env',
          blocklist: null,
          allowlist: null,
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
      [
        'babel-plugin-inline-import',
        {
          extensions: ['.md'],
        },
      ],
      [
        'module-resolver',
        {
          alias: {
            'isomorphic-webcrypto': 'isomorphic-webcrypto/src/react-native',
            'fast-text-encoding': 'fast-text-encoding/text',
            jsonld: '@digitalcredentials/jsonld',
            'jsonld-signatures': '@digitalcredentials/jsonld-signatures',
          },
        },
      ],
    ],
  };
};
