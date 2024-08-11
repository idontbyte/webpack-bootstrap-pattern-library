const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const glob = require("glob");
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const path = require('path');

const PATHS = {
    src: path.join(__dirname, "src"),
};

module.exports = {
    mode: 'production',
    output: {
        filename: 'js/[name].[contenthash:8].js',
        path: path.resolve(__dirname, 'dist'),
    },
    performance: {
        hints: false,
    },
    module: {
        rules: [
            {
                test: /\.(sass|scss)$/,
                use: [
                    
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                quietDeps: true, // Suppresses deprecation warnings from dependencies
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(ico|png|jpe?g|webp|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name].[hash:8][ext][query]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[hash:8][ext][query]',
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['css/*', 'js/*', 'fonts/*'],
            cleanAfterEveryBuildPatterns: [],
            dangerouslyAllowCleanPatternsOutsideProject: true,
            dry: false,
        }),
        new HtmlBundlerPlugin({
            entry: 'src/views/', // Adjust to explicitly include only HTML files
            css: {
                filename: 'css/[name].[contenthash:8].css', // Ensure unique filenames for CSS
            },
        }),
        new PurgeCSSPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    compress: {
                        unused: true,
                        dead_code: true,
                        drop_console: true,
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 9123,
        hot: true,
        open: true,
    },
};