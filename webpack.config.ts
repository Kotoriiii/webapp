import { Configuration } from 'webpack';
import path from 'path';
import nodeExternals from 'webpack-node-externals';
import WebpackShellPlugin from 'webpack-shell-plugin-next';

const getConfig = (
  env: { [key: string]: string },
  argv: { [key: string]: string }
): Configuration => {
  console.log(env);
  return {
    entry: path.join(__dirname, '/src/bin/server.ts'),
    output: {
      filename: 'index.js',
      path:
        argv.mode === 'production' ? path.join(__dirname, 'dist') : path.join(__dirname, 'build')
    },
    target: 'node',
    mode: argv.mode === 'production' ? 'production' : 'development',
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          loader: 'ts-loader',
          options: {},
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        src: path.join(__dirname, 'src')
      }
    },
    optimization: {
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all'
      }
    },
    plugins: [
      new WebpackShellPlugin({
        onBuildStart: {
          scripts: ['npm run prisma-migrate && npm run clean:dev && npm run clean:prod'],
          blocking: true,
          parallel: false
        },
        onBuildEnd:
          argv.mode != 'development'
            ? {
                scripts: ['npm run dev'],
                blocking: false,
                parallel: true
              }
            : {}
      })
    ]
  };
};

export default getConfig;
