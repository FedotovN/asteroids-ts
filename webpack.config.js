const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';

const config = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        host: 'localhost',

    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        })
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|wav)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
        alias: {
            '@': path.join(__dirname, './src'),
        }
    },
};
module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
    } else {
        config.mode = 'development';
    }
    return config;
};