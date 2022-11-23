import * as path from 'path';
import { Configuration, ProgressPlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import 'webpack-dev-server';

const config: Configuration = {
    mode: 'development',
    entry: { index: './app/index.tsx' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true,
    },
    devServer: {
        hot: true,
        static: [
            {
                directory: path.join(__dirname, 'public'),
            }
        ],
        compress: true,
        port: 3000,
        client: {
            progress: true,
            overlay: true,
        },
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /(\.tsx?$)|(\.jsx?$)/,
                use: {
                    loader: 'swc-loader',
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
        ],
    },
    plugins: [
        new ProgressPlugin(),
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public/index.html') }),
    ],
    optimization: {
        runtimeChunk: 'single',
    },
}

export default config;