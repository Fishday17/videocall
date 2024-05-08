const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');//负责解析'vue'文件中的各个部分（模板、脚本、样式）并将其转换为webpack可处理的模块 = require('vue-loader/lib/plugin');//负责解析'vue'文件中的各个部分（模板、脚本、样式）并将其转换为webpack可处理的模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); //生成html
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//将css打包后的js文件中抽取出来，生成独立的css文件。通过抽取css到独立的文件可以实现样式的分离和优化。通过配置入口文件、输出文件、模块解析规则等。
module.exports = {
    // 1. 指定入口文件
    entry: './src/main.js',
    // 2. 指定输出文件
    output: {
        path: path.resolve(__dirname, 'dist'),//在这个配置中，所有生成的文件将被输出到该目录下。
        //它能够确保生成的路径是标准化的绝对路径，无论在哪个操作系统上运行代码，路径都能够正确解析。
        filename: 'main.js',
        publicPath: './',
    },
    // 3. 配置模块解析规则
    module: {
        rules: [
            {
                // 处理.vue文件
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                // 处理.js文件, 使用Babel进行转义
                test: /\.js$/,
                exclude: /node_modules/,        //排除/node_modules/
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                // 处理css文件
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,//将css文件单独处理
                    'css-loader',//加载css文件
                ],
            },
        ],
    },

    // 4. 配置解析别名
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js',//在引入vue.js时可以使用别名'vue'
        },
    },

    // 5. 配置插件
    plugins: [
        new VueLoaderPlugin(), // 处理.vue文件的模块转换为js模块
        new HtmlWebpackPlugin({ // 根据模板生成html文件，将打包后的脚本的样式自动引入
            template: './index.html',
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({ // 将CSS抽取到单独的文件
            filename: 'style.css',
        }),
    ],

    // 6. 配置开发服务器
    devServer: {//用于配置开发服务器的相关参数，如监听的端口、内容目录等
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
    },
};