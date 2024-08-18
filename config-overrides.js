const { override } = require("customize-cra");
const path = require("path");

// override
module.exports = {
  webpack: override(
    // customize-cra plugins here

    (config) => {
      config.devtool = false;

      config.output = {
        ...config.output,
        path: path.resolve(__dirname, "build"),
        filename: "static/js/[name].js",
        chunkFilename: "static/js/[name].chunk.js",
        assetModuleFilename: "static/media/[name][ext]",
      };

      config.optimization = {
        runtimeChunk: false,
        minimize: true,
        splitChunks: {
          cacheGroups: {
            default: false,
          },
        },
      };

      //CSS
      config.plugins.map((plugin, i) => {
        if (plugin?.HtmlWebpackPlugin) {
          console.log(plugin);
          
        }
        
        if (
          plugin?.options?.filename &&
          plugin.options.filename.includes("static/css")
        ) {
          config.plugins[i].options.filename = `static/css/main.chunk.css`;
        }
      });

      return config;
    }
  ),

  jest: (config) => {
    return config;
  },

  devServer: (configFunction) => (proxy, allowedHost) => {
    const config = configFunction(proxy, allowedHost);
    console.log(config);

    return config;
  },

  paths: (paths, env) => {
    return paths;
  },
};
