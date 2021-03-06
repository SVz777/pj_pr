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
    context: root_path,
    entry: {
        index: path.join(__dirname, 'src/index.tsx'),
        home: path.join(__dirname, 'src/home.tsx'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    devtool: isDebug ? "source-map" : false,// 'source-map', // 'source-map', //'cheap-eval-source-map',
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"],
        modules: ['src', 'node_modules'],
    },
    module: {
        rules: [
            //            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            //   { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            //   // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            //   { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.tsx?$/,
                loaders: [
                    {
                        loader: 'babel-loader',

                        options: {
                            cacheDirectory: true,
                            presets: ['es2015', 'react', 'stage-0'],
                            babelrc: true,
                            plugins: [['import', [{ libraryName: "antd", style: 'css' }]]]
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            compilerOptions: {
                                module: 'es6'
                            }
                        },
                    }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(less|css)$/,
                use: isDebug ?
                    ["style-loader",
                        "css-loader",

                        {
                            loader: 'less-loader', options: {
                                javascriptEnabled: true,
                                modifyVars: {
                                    'font-size-base': '12px'
                                    //'ant-prefix'             : 'hy'
                                    // 'primary-color': '#1DA57A',
                                    // 'link-color': '#1DA57A',
                                    // 'border-radius-base': '2px',
                                },

                            }
                        }
                    ] : [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        //   "style-loader",
                        {
                            loader: 'css-loader',
                            options: {
                                //   modules: true,
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'less-loader', options: {
                                javascriptEnabled: true,
                                modifyVars: {
                                    'font-size-base': '12px'
                                    //'ant-prefix'             : 'hy'
                                    // 'primary-color': '#1DA57A',
                                    // 'link-color': '#1DA57A',
                                    // 'border-radius-base': '2px',
                                },

                            }
                        }

                        // "less-loader?javascriptEnabled=true"
                    ]
            },
            {
                test: /\.scss$/,
                use: isDebug ? ["style-loader",
                    "css-loader",

                    "sass-loader?javascriptEnabled=true"] : [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    //   "style-loader",
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: true
                        }
                    },

                    "sass-loader?javascriptEnabled=true"
                ]
            },
            // {
            //     test: /\.jsx?$/,
            //     exclude: /(node_modules|bower_components)/,
            //     loader: 'babel-loader',
            //     options: {
            //         cacheDirectory:true,

            //         presets: ['es2015', 'react', 'stage-0'],
            //         plugins: [

            //         ]
            //     }
            // },


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
                sourceMap: isDebug, // set to true if you want JS source maps,
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
                    chunks: 'all',
                    priority: 0,
                    minChunks: 2,
                    reuseExistingChunk: false,
                    test: /[\\/]node_modules[\\/]/,
                    enforce: true
                },
                commons: {
                    // async 设置提取异步代码中的公用代码
                    chunks: "async",
                    name: 'commons',
                    /**
                     * minSize 默认为 30000
                     * 想要使代码拆分真的按照我们的设置来
                     * 需要减小 minSize
                     */
                    minSize: 0,
                    // 至少为两个 chunks 的公用代码
                    minChunks: 2
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
                NODE_ENV: isDebug ? JSON.stringify('development') : JSON.stringify('production')
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
            minify: !isDebug,

            chunks: ['vendor', 'index'] // 这个模板对应上面那个节点
        }),
        new HtmlWebpackPlugin({
            filename: path.join(__dirname, 'dist/home.html'),
            template: path.join(__dirname, 'src/template/normal.tpl'),
            inject: 'body',
            hash: true,
            cache: true,
            minify: !isDebug,

            chunks: ['vendor', 'home'] // 这个模板对应上面那个节点
        }),
        // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/)
    ]
};