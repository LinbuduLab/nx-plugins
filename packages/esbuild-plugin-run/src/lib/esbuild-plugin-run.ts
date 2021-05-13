import execa, { Options, ExecaChildProcess } from 'execa';
import path from 'path';
import { Plugin } from 'esbuild';
import fs from 'fs-extra';

const debug = require('debug')('plugin:run');

export interface RunOptions {
  execaOptions?: Options;
}

// 支持outDir，即多入口
// 首次构建必定不存在，跳过
//

export default (options: RunOptions = {}): Plugin => {
  let execaProcess: ExecaChildProcess<string>;

  return {
    name: 'esbuild:run',
    async setup({ initialOptions }) {
      debug('start');

      if (
        initialOptions.write &&
        typeof initialOptions.write === 'boolean' &&
        (initialOptions.write as boolean) === false
      ) {
        throw new Error(
          'You must enable build.write option for script execution'
        );
      }

      const fork = (filePath: string) => {
        if (execaProcess && !execaProcess.killed) {
          execaProcess.kill();
        }

        execaProcess = execa.node(filePath, {
          stdio: 'inherit',
          ...(options?.execaOptions ?? {}),
        });

        return execaProcess;
      };

      // support single entry only for now
      if (!initialOptions.outfile) {
        throw new Error('only single entry is supported!');
      }

      const filePath = path.join(process.cwd(), initialOptions.outfile);

      if (!fs.existsSync(filePath)) {
        // TODO: 提示说明
        // 需要启用watch选项，并在第一次构建完成后输入rs/restart来启动
        console.warn(
          "ESBuild doesn't support buildEnd or writeBundle hooks(just like rollup), so..."
        );
        return;
      }

      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      process.stdin.on('data', (data) => {
        const line = data.toString().trim().toLowerCase();
        console.log(data.toString().charCodeAt(0));
        if (line === 'rs' || line === 'restart') {
          fork(filePath);
        } else if (line === 'cls' || line === 'clear') {
          console.clear();
        }
      });

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          debug('resolved');
          fork(filePath).then((cp) => {
            resolve();
          });
        });
      });
    },
  };
};
