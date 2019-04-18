const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isDebug = process.env.NODE_ENV === 'development';
const root_path = __dirname;
module.exports = {
    mode: isDebug ? 'development' : 'production',
    context: __dirname,
    entry: {
        index:path.join(__dirname,'src/index.js'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    devtool:isDebug?"source-map":false,// 'source-map', // 'source-map', //'cheap-eval-source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['es2015', 'react','stage-0'],
                    plugins: [
                        // ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        
                    ]
                }
            },
            {
                test: /\.tsx?$/,
                loaders: [
                    {
                        loader: 'babel-loader',

                        options: {
                            cacheDirectory:true,
                            presets: ['es2015', 'react', 'stage-0'],
                            babelrc: true,
                            plugins: ['react-hot-loader/babel'],
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            getCustomTransformers: () => ({
                                before: [ tsImportPluginFactory({
                                    libraryName: 'antd',
                                    libraryDirectory: 'es',
                                    style: true
                                })]
                            }),
                            compilerOptions: {
                                module: 'es6'
                            }
                        },
                    }
                ],

            },
            {
                test: /\.scss|css$/,
                use: [
                    // MiniCssExtractPlugin.loader,
                    'style-loader',
                    'css-loader',
                    'resolve-url-loader',
                    'sass-loader?sourceMap'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            sourceMap: true
                           
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            optipng: {
                                optimizationLevel: 7
                            },
                            gifsicle: {
                                interlaced: false
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            },
                            mozjpeg: {
                                quality: 65,
                                progressive: true
                            }
                        }
                    }
                ]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader'
            }
        ]
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap:isDebug, // set to true if you want JS source maps,
                uglifyOptions: {
                    warnings: isDebug
                }
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        // runtimeChunk: {
        //     name: 'manifest'
        // },
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: false,
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    priority: 0,
                    minChunks: 3,
                    reuseExistingChunk: false,
                    test: /node_modules\/(.*)\.js/
                }
            }
        }
    },
    performance: {
        hints: false
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV:isDebug?JSON.stringify('development'): JSON.stringify('production')
            }
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new CleanWebpackPlugin(
            [
                'dict/cached_uglify/*.js',
                'dict/cached_uglify/cached_uglify/*.js'
            ], // 匹配删除的文件
            {
                root: __dirname, // 根目录
                verbose: true, // 开启在控制台输出信息
                dry: false // 启用删除文件
            }
        ),
        new MiniCssExtractPlugin({
            filename: 'static/css/app.[name].css',
            chunkFilename: 'static/css/app.[contenthash:12].css'
        }),
        
        new HtmlWebpackPlugin({
            filename: path.join(__dirname, 'dist/index.html'),
            template: path.join(__dirname, 'src/template/normal.tpl'),
            inject: 'body',
            hash: true,
            cache: true,
            minify:!isDebug,

            chunks: ['index'] // 这个模板对应上面那个节点
        }),
        // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/)
    ]
};