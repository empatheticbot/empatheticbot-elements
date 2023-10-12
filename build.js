import {exec} from 'child_process';
import fs from 'fs/promises';

import esbuild from 'esbuild';
import chalk from 'chalk';
import commandLineArgs from 'command-line-args';
import {globby} from 'globby';
import browserSync from 'browser-sync';

let context;

process.on('SIGTERM', () => {
  if (context) {
    context.dispose();
  }
});

const {outdir, serve, types, analyze} = commandLineArgs([
  {name: 'outdir', type: String, defaultValue: 'dist'},
  {name: 'serve', type: Boolean, defaultValue: false},
  {name: 'types', type: Boolean, defaultValue: false},
  {name: 'analyze', type: Boolean, defaultValue: false},
]);

async function clean(directory) {
  if (!directory) {
    return;
  }
  try {
    await fs.rm(directory, {recursive: true, force: true});
    await fs.mkdir(directory, {recursive: true});
  } catch (error) {
    console.error(
      chalk.red(`Failed to clean directory '${directory}'.\n\t ${error}`)
    );
  }
}

async function generateTypes(directory) {
  return new Promise((resolve, reject) => {
    try {
      exec(
        `tsc --project ./tsconfig.json --outdir "${directory}"`,
        {
          stdio: 'inherit',
        },
        (error, stdout, stderr) => {
          console.log(error, stdout, stderr);
          if (error) {
            reject(stderr);
          }
          console.log(chalk.green('Types generated!'));
          resolve(stdout);
        }
      );
    } catch (error) {
      console.error(chalk.red(`Failed to generate types.\n\t ${error}`));
      reject(`Failed to generate types.\n\t ${error}`);
    }
  });
}

async function build() {
  console.log(!context);
  if (!context) {
    try {
      context = await esbuild
        .context({
          format: 'esm',
          target: 'es2020',
          entryPoints: [
            './src/index.ts',
            ...(await globby('./src/**/!(*.style|test).ts')),
            ...(await globby('./src/**/*.html')),
            ...(await globby('./src/assets/**')),
          ],
          loader: {'.html': 'copy', '.png': 'copy'},
          outdir,
          chunkNames: 'chunks/[name].[hash]',
          bundle: true,
          external: [],
          splitting: true,
          plugins: [],
          metafile: analyze,
          sourcemap: true,
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error(chalk.red(`Failed to setup build context.\n\t ${error}`));
      process.exit(1);
    }
  }
  try {
    const result = await context.rebuild();
    console.log(chalk.green('Library build successful!'));
    return result;
  } catch (error) {
    console.error(chalk.red(`Failed to build library.\n\t ${error}`));
  }
}

async function startServer() {
  const bs = browserSync.create();

  const browserSyncConfig = {
    startPath: '/',
    port: '3000',
    logFileChanges: true,
    notify: false,
    ghostMode: false,
    server: {
      baseDir: './dist',
    },
    ignore: ['src/**/*.test.ts'],
  };

  bs.init(browserSyncConfig, () => {
    const url = `http://localhost:${bs.getOption('port')}`;
    console.log(chalk.cyan(`Launched server at: ${url}`));
  });

  bs.watch(['src/**/!(*.test).*']).on('change', async (filename) => {
    console.log(chalk.blue(`Source file changed - ${filename}`));
    try {
      await build();
      bs.reload();
    } catch (error) {
      console.error(
        chalk.red(`Failed to rebuild and reload library.\n ${error}`)
      );
    }
  });
}

(async function () {
  try {
    await clean(outdir);
    if (types) {
      await generateTypes(outdir);
    }
    await build();
    if (serve) {
      await startServer();
    }
    if (!serve) {
      process.exit(0);
    }
  } catch (error) {
    console.error(`Failed. ${error}`);
  }
})();
