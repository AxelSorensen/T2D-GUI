const { defineConfig } = require('@vue/cli-service');
const path = require('path');


const obfuscatorOptions = {
  compact: true,
  controlFlowFlattening: false,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false,
  debugProtectionInterval: 0,
  disableConsoleOutput: true,
  domainLock: [],
  domainLockRedirectUrl: 'about:blank',
  forceTransformStrings: [],
  identifierNamesCache: null,
  identifierNamesGenerator: 'hexadecimal',
  identifiersDictionary: [],
  identifiersPrefix: '',
  ignoreImports: false,
  inputFileName: '',
  log: false,
  numbersToExpressions: false,
  optionsPreset: 'default',
  renameGlobals: false,
  renameProperties: false,
  renamePropertiesMode: 'safe',
  reservedNames: [],
  reservedStrings: [],
  seed: 0,
  selfDefending: true,
  simplify: true,
  sourceMap: false,
  sourceMapBaseUrl: '',
  sourceMapFileName: '',
  sourceMapMode: 'separate',
  sourceMapSourcesMode: 'sources-content',
  splitStrings: false,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 0.5,
  stringArrayEncoding: [],
  stringArrayIndexesType: [
    'hexadecimal-number'
  ],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 2,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  target: 'browser',
  transformObjectKeys: true,
  unicodeEscapeSequence: false
}



var WebpackObfuscator = require('webpack-obfuscator');

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/T2D-GUI/' : './',
  transpileDependencies: true,
  pwa: {
    workboxOptions: {
      skipWaiting: true
    },
    themeColor: '#22234e',
  },
  configureWebpack: process.env.NODE_ENV === 'production' ? {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [ path.resolve(__dirname, "src/core") ],
          enforce: 'post',
          use: { loader: WebpackObfuscator.loader, options: obfuscatorOptions }
        },
      ]
    }
  } : {}
})

