const util = require('util');
const fs = require('fs');
const path = require('path');
const SVGSpriter = require('svg-sprite');
const File = require('vinyl');

const readDirAsync = util.promisify(fs.readdir);
const rootDir = path.join(__dirname);

const initIcons = async () => {
  const iconsDir = path.join(rootDir, 'styles', 'icon');

  const mode = 'defs';

  const spriter = new SVGSpriter({
    dest: path.resolve(rootDir, 'styles'),
    mode: {
      [mode]: {
        dest: '.',
        prefix: '.icon-%s',
        sprite: 'icon/sprite.svg',
        bust: false,
        render: {
          scss: true
        }
      }
    }
  });

  const iconFiles = ((await readDirAsync(iconsDir)) || []).filter(
    (f) => f && !['.', '..', 'sprite.svg', '.DS_Store'].includes(f)
  );

  (iconFiles || []).forEach((file) => {
    spriter.add(
      new File({
        path: path.join(iconsDir, file), // Absolute path to the SVG file
        base: iconsDir, // Base path (see `name` argument)
        contents: fs.readFileSync(path.join(iconsDir, file)) // SVG file contents
      })
    );
  });

  spriter.compile((error, result, data) => {
    const sprite = result[mode].sprite;
    const style = result[mode].scss;
    const example = result[mode].example;

    // console.log(sprite.path);
    // console.log(style.path);

    fs.writeFileSync(
      path.join(rootDir, 'styles', '_icons.scss'),
      style.contents
    );

    fs.writeFileSync(
      path.join(rootDir, 'public', 'icons.svg'),
      sprite.contents
    );

    if (example?.path) {
      fs.writeFileSync(example.path, example.contents);
    }

    fs.writeFileSync(
      path.join(__dirname, 'component', 'icon', '_icons.type.ts'),
      `export type IconId =\n  | ${iconFiles
        .map((i) => `'${path.parse(i).name}'`)
        .join('\n  | ')};\n`
    );
  });
};

Promise.all([initIcons()]);
