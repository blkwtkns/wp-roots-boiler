import webpack from 'webpack';
import path from 'path';

import ExtractTextPlugin from 'extract-text-webpack-plugin';

// Source and Output directories
// __dirname is the current directory of this file (node.js variable)
// const sourcePath = path.join(__dirname, './src');
const sourcePath = path.join(__dirname, './themeContainer');
const outputPath = path.join(__dirname, './web/app/themes/dist/');

// Environment
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

// Plugins
// ----------------------------------------------------------- //
const plugins = [
  // Allow you to reference environment variables through process.env
  new webpack.EnvironmentPlugin({
    NODE_ENV: nodeEnv
  }),

  // Prints more readable module names in the browser console on HMR updates
  // prevent ID's from changing, invalidating the cache
  // new webpack.NamedModulesPlugin(),

  // Generates chunks of common modules shared between entry points
  // and splits them into separate bundles
  // new webpack.optimize.CommonsChunkPlugin({
  //   name: ['vendor', 'manifest'],
  //   minChunks: Infinity
  // }),

  // test
  new ExtractTextPlugin({filename: 'bundle.css', allChunks: true}),
];

// add to plugins array based on prod/dev environment
// If in production
// if (isProd) {
//   plugins.push(
//     // minify the code
//     new webpack.LoaderOptionsPlugin({
//       minimize: true,
//       debug: false
//     }),
//     // and uglify it
//     new webpack.optimize.UglifyJsPlugin({
//       compress: {
//         warnings: false,
//         screw_ie8: true,
//         conditionals: true,
//         unused: true,
//         comparisons: true,
//         sequences: true,
//         dead_code: true,
//         evaluate: true,
//         if_return: true,
//         join_vars: true
//       },
//       output: {
//         comments: false
//       }
//     })
//   );
// // if in development mode
// } else {
//   // add dev plugins here
// }

// export default {
//   // DevTools
//   // ----------------------------------------------------------- //
//   // add support for the Chrome DevTools Extension
//   // use eval in prod to see compiled output
//   // use source maps if in dev
//   devtool: isProd ? 'cheap-source-map' : 'cheap-module-eval-source-map',
// 	// devtool: 'source-map',
//
//   // Context
//   // ----------------------------------------------------------- //
//   // start in our source path directory
//   context: sourcePath,
//
//   // Entry
//   // ----------------------------------------------------------- //
//   // Tell webpack where to start and follows the graph of dependencies
//   // so it knows what to bundle
//   // to bundle multiple files into one:
//   // entry: {
//   //   myBundleName: ['./home.js', './events.js', './vendor.js']
//   // }
//   // multiple files with multiple outputs:
//   // entry: {
//   //   fileNameOne: './file.js',
//   //   fileNameTwo: './anotherFile.js'
//   // }
//   entry: {
//     // dev files
//     scripts: [
//       // './scripts/scripts.js'
//       './src/index.js'
//     ],
//     // vendor files
//     // manually tell webpack to group certain files
//     // instead of just relying on the CommonsChunkPlugin
//     vendor: [
//       'jquery',
//       'jquery.easing',
//       'modernizr',
//       'postal',
//       'ScrollMagic',
//       'TweenMax',
//       'jquery.ScrollMagic',
//       'animation.gsap',
//       'debug.addIndicators'
//     ]
//   },
//
//   // Output
//   // ----------------------------------------------------------- //
//   // where the files will be saved to
//   output: {
//     path: outputPath,
//     publicPath: '/',
//     // filename: '[name].js',
//     // chunkFilename: '[name].chunk.js',
//     // sourceMapFilename: '[file].map'
//
//     filename: 'bundle.js',
//     // chunkFilename: '[name].chunk.js',
//     // sourceMapFilename: '[file].map'
//   },
//
//   // Resolve
//   // ----------------------------------------------------------- //
//   // help webpack resolve import statements
//   // e.g. import React from 'react';
//   resolve: {
//     // define file extensions
//     // so you can leave them off when importing
//     extensions: [
//       '.webpack-loader.js',
//       '.web-loader.js',
//       '.loader.js',
//       '.js'
//     ],
//
//     // tell webpack where to find files
//     // allows you to include them without the full path
//     modules: [
//       path.resolve(__dirname, 'node_modules'),
//       sourcePath
//     ],
//
//     alias: {
//       modernizr$: path.resolve(__dirname, '.modernizrrc'),
//       postal: isProd ?
//         path.resolve('node_modules', 'postal/lib/postal.lodash.min.js') :
//         path.resolve('node_modules', 'postal/lib/postal.lodash.js'),
//       ScrollMagic: isProd ?
//         path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js') :
//         path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js'),
//       'animation.gsap': isProd ?
//         path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js') :
//         path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js'),
//       'debug.addIndicators': isProd ?
//         path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js') :
//         path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js'),
//       'jquery.ScrollMagic': isProd ?
//         path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/plugins/jquery.ScrollMagic.min.js') :
//         path.resolve('node_modules', 'scrollmagic/scrollmagic/uncompressed/plugins/jquery.ScrollMagic.js'),
//       TweenLite: isProd ?
//         path.resolve('node_modules', 'gsap/src/minified/TweenLite.min.js') :
//         path.resolve('node_modules', 'gsap/src/uncompressed/TweenLite.js'),
//       TweenMax: isProd ?
//         path.resolve('node_modules', 'gsap/src/minified/TweenMax.min.js') :
//         path.resolve('node_modules', 'gsap/src/uncompressed/TweenMax.js'),
//       TimelineLite: isProd ?
//         path.resolve('node_modules', 'gsap/src/minified/TimelineLite.min.js') :
//         path.resolve('node_modules', 'gsap/src/uncompressed/TimelineLite.js'),
//       TimelineMax: isProd ?
//         path.resolve('node_modules', 'gsap/src/minified/TimelineMax.min.js') :
//         path.resolve('node_modules', 'gsap/src/uncompressed/TimelineMax.js'),
//       CSSRulePlugin: isProd ?
//         path.resolve('node_modules', 'gsap/src/minified/plugins/CSSRulePlugin.min.js') :
//         path.resolve('node_modules', 'gsap/src/uncompressed/plugins/CSSRulePlugin.js'),
//       Easing: isProd ?
//         path.resolve('node_modules', 'gsap/src/minified/easing/EasePack.min.js') :
//         path.resolve('node_modules', 'gsap/src/uncompressed/easing/EasePack.js'),
//     }
//   },
//
//   // Loaders
//   // ----------------------------------------------------------- //
//   // Tell webpack what loader to use for each module based on file type
//   // Webpack treats every file (.css, .html, .scss, .jpg, etc.) as a module
//   // Transformations/preprocessing can be applied to the source code of a module
//   module: {
//     rules: [
//       // static files (images, svgs, fonts)
//       {
//         test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
//         loader: 'file-loader?name=/[hash].[ext]'
//       },
//       // JSON
//       {
//         test: /\.json$/,
//         loader: 'json-loader'
//       },
//       // Javascript
//       // {
//       //   loader: 'babel-loader',
//       //   test: /\.js?$/,
//       //   exclude: /node_modules/,
//       //   query: { cacheDirectory: true }
//       // },
//       {
//         test: /\.jsx?$/,
//         exclude: /(node_modules|bower_components)/,
//         loader: 'babel-loader',
//         query: {
//           presets: ['env', 'stage-2', 'react', 'minify'],
//         },
//       },
//       // Modernizr
//       // create custom build based on .modernizrrc.json file
//       // all the options: https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json
//       {
//         test: /\.modernizrrc(\.json)?$/,
//         exclude: /node_modules/,
//         use: ['modernizr-loader', 'json-loader']
//       },
//       //
//       {
//         test: /\.scss$/,
//         exclude: /(node_modules|bower_components)/,
//         use: ExtractTextPlugin.extract({
//           use: [
//             {
//               loader: 'css-loader',
//               options: {sourceMap: true},
//             }, {
//               loader: 'postcss-loader',
//               options: {
//                 sourceMap: true,
//                 plugins: () => ([
//                   require('autoprefixer')({
//                     browsers: ['last 2 versions', 'ie > 8'],
//                   }),
//                 ]),
//               },
//             }, {
//               loader: 'sass-loader',
//               options: {sourceMap: true},
//             }],
//         }),
//       },
//     ]
//   },
//
//   // see plugins setup above
//   // ----------------------------------------------------------- //
//   plugins,
//
//   // Stats
//   // ----------------------------------------------------------- //
//   stats: {
//     colors: {
//       green: '\u001b[32m'
//     }
//   }
// };


 export default {
	devtool: 'source-map',
	entry: './themeContainer/src/index.js',
	output: {
		// path: __dirname,
    path: outputPath,
		filename: 'bundle.js',
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['env', 'stage-2', 'react', 'minify'],
				},
			},
			{
				test: /\.scss$/,
				exclude: /(node_modules|bower_components)/,
				use: ExtractTextPlugin.extract({
					use: [
						{
							loader: 'css-loader',
							options: {sourceMap: true},
						}, {
							loader: 'postcss-loader',
							options: {
								sourceMap: true,
								plugins: () => ([
									require('autoprefixer')({
										browsers: ['last 2 versions', 'ie > 8'],
									}),
								]),
							},
						}, {
							loader: 'sass-loader',
							options: {sourceMap: true},
						}],
				}),
			},
		],
	},
  // see plugins setup above
  // ----------------------------------------------------------- //
  plugins,
  // Stats
  // ----------------------------------------------------------- //
  stats: {
    colors: {
      green: '\u001b[32m'
    }
  }
};
