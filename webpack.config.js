// モジュールの読み込み
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');

// 変数の設定
const PROJECT_DIR = '01';
const MODE = 'production';
const enabledSourceMap = MODE === 'development';

// 設定
module.exports = {
  mode: MODE,
  entry: `./src/${PROJECT_DIR}/main.ts`,
  output: {
    path: `${__dirname}/docs/${PROJECT_DIR}`,
    filename: 'script.js',
  },

  module: {
    rules: [
      // TypeScript用
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      // Scss用
      {
        test: /\.scss/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: enabledSourceMap,
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: enabledSourceMap
            },
          },
        ],
      },
      // Pug用
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].html',
            },
          },
          'extract-loader',
          {
            loader: 'html-loader',
          },
          {
            loader: 'pug-html-loader',
            // options: {
            //   pretty: true,
            // },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${__dirname}/src/${PROJECT_DIR}/img/`,
          to: `${__dirname}/docs/${PROJECT_DIR}/img/[name][ext]`,
        },
      ],
    }),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      plugins: [
        ImageminMozjpeg({
          quality: 85,
          progressive: true,
        }),
      ],
      pngquant: {
        quality: '70-85',
      },
      gifsicle: {
        interlaced: false,
        optimizationLevel: 10,
        colors: 256,
      },
      svgo: {},
    }),
  ],

  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
};
