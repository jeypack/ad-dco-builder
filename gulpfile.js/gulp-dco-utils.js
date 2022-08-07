/**
 * GULP WEB
 * AUTHOR: J. Pfeifer (c) 2019-2022
 * LICENSE: GNU GENERAL PUBLIC LICENSE
 */
const { src, dest } = require("gulp");
const del = require("del");
const gulpif = require("gulp-if");
const removeLogging = require("gulp-remove-logging");
//const saveLicense = require('uglify-save-license');
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
//can-not-use cache and imagemin without import
//const cache = require("gulp-cache");
//import imagemin from 'gulp-imagemin';
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const flexbugsfixer = require("postcss-flexbugs-fixes");
const browserSync = require("browser-sync").create();
//const tap = require('gulp-tap');
const reload = browserSync.reload;
// npm i gulp-if autoprefixer browser-sync gulp-clean-css gulp-concat gulp-postcss gulp-rename gulp-remove-logging gulp-sass gulp-uglify

module.exports.dcoJSMin = (source, destination) => {
  return src(source).pipe(concat("dco.min.js")).pipe(dest(destination));
};

//
module.exports.cleanDir = function (dir, force) {
  if (typeof force === "undefined") {
    force = false;
  }
  del.sync(dir, { force: force });
};

// here we expicitly set src and destination for reuse
module.exports.moveFiles = function (sources, destination, renameTo) {
  let counter = 0,
    length = sources.length,
    stream = src(sources);
  //
  if (renameTo) {
    stream = stream.pipe(concat(renameTo));
  }
  /*stream = stream.pipe(tap(function (file) {
        //let fileJson = JSON.parse(file.contents.toString());
        console.log(grey('moveFiles tap path:'), bold(++counter), file.path);
    }));*/
  return stream.pipe(dest(destination)).pipe(reload({ stream: true }));
};

// IMAGES
module.exports.handleImages = function (initObj, destination) {
  //let counter = 0, length = initObj.SRC_IMAGES.length;
  //console.log(red.bold('gulp-dco-utils handleImages'), red.bold('initObj.SRC_IMAGES:'), initObj.SRC_IMAGES);
  //console.log(red.bold('gulp-dco-utils handleImages'), red.bold('destination:'), (destination || initObj.DEST_IMAGES));
  return (
    src(initObj.SRC_IMAGES)
      /* .pipe(
        cache(
          imagemin([
            imagemin.gifsicle({ interlaced: false }),
            imagemin.mozjpeg({ quality: 75, progressive: false }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
              plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
            }),
          ])
        )
      ) */
      .pipe(dest(destination || initObj.DEST_IMAGES))
      .pipe(reload({ stream: true }))
  );
};

// PHP or HTML
module.exports.handleHtml = function (initObj, destination, filename) {
  console.log(
    "gulp-dco-utils handleHtml destination:",
    destination,
    "filename:",
    filename
  );
  return (
    src(initObj.SRC_TPL_HTML)
      .pipe(
        gulpif(
          !initObj.DEVELOPMENT,
          htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: { compress: { drop_console: true } },
            processConditionalComments: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: false,
            removeStyleLinkTypeAttributes: true,
          })
        )
      )
      // only rename if fname does not exists
      //.pipe(gulpif(filename, rename(filename)))
      .pipe(rename(filename))
      .pipe(dest(destination || initObj.DEST))
      .pipe(reload({ stream: true }))
  );
};

// PHP or HTML
module.exports.handlePHtml = function (initObj, destination, filename) {
  let fname = initObj.PHTML_FILENAME || filename,
    hasFilename = !!(fname && fname !== "");
  //console.log(red.bold('gulp-dco-utils handlePHtml'), red.bold('fname:' + fname), 'hasFilename:', hasFilename);
  return (
    src(initObj.SRC_HTML)
      .pipe(
        gulpif(
          !initObj.DEVELOPMENT,
          htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: { compress: { drop_console: true } },
            processConditionalComments: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
          })
        )
      )
      // only rename if fname does not exists
      .pipe(
        gulpif(hasFilename, rename(fname + "." + (initObj.PHTML_EXT || "html")))
      )
      .pipe(dest(destination || initObj.DEST))
      .pipe(reload({ stream: true }))
  );
};

//  SASS
module.exports.buildCssFromScss = function (initObj) {
  const pathIncludes = initObj.PATH_INCLUDES_SASS || [];
  const output = initObj.DEVELOPMENT ? "expanded" : "compressed";
  const processors = [autoprefixer, flexbugsfixer];
  return (
    src(initObj.SRC_SASS, { sourcemaps: initObj.DEVELOPMENT })
      //.pipe(gulpif(initObj.DEVELOPMENT, sourcemaps.init()))
      .pipe(
        sass
          .sync({
            outputStyle: output,
            precision: 10,
            includePaths: pathIncludes,
          })
          .on("error", sass.logError)
      )
      //.pipe(gulpif(initObj.DEVELOPMENT, sourcemaps.write('./')))
      .pipe(postcss(processors))
      //.pipe(gulpif(!initObj.DEVELOPMENT, cssnano({ safe: true })))
      .pipe(gulpif(!initObj.DEVELOPMENT, cleanCSS({ compatibility: "ie9" })))
      .pipe(concat(initObj.CSS_FILENAME + ".css"))
      .pipe(dest(initObj.DEST))
      .pipe(reload({ stream: true }))
  );
};

// JAVASCRIPT
module.exports.handleJS = function (initObj) {
  let counter = 0,
    length = initObj.SRC_JS.length,
    stream = src(initObj.SRC_JS);
  //console.log(red.bold('handleJS initObj.DO_PRINT:'), grey.bold(JSON.stringify(initObj)));
  /*stream = stream.pipe(tap(function (file) {
        //let fileJson = JSON.parse(file.contents.toString());
        console.log(grey('handleJS tap path:'), bold(++counter), file.path);
    }));*/
  return (
    stream
      .pipe(concat(initObj.JS_FILENAME + ".js"))
      .pipe(
        gulpif(
          !initObj.DEVELOPMENT,
          removeLogging({
            methods: ["log", "info"],
          })
        )
      )
      .pipe(gulpif(!initObj.DEVELOPMENT, uglify()))
      /*.pipe(gulpif(!initObj.DEVELOPMENT, uglify({
			output: { comments: saveLicense }
		})))*/
      .pipe(dest(initObj.DEST))
      .pipe(reload({ stream: true }))
  );
};

//
// Watch Files For Changes
//old -> (dir, port = 3000, serve = 'index.html')
//proxy -> "http://localhost/" + folder
// watchBrowser({ proxy: false, baseDir: egpTempFolder, index: 'index-grid-layout.html' });
module.exports.watchBrowser = function (initObj) {
  if (!initObj) {
    return;
  }
  var key, value, obj;
  if (initObj.proxy && typeof initObj.proxy === "string") {
    obj = {
      proxy: initObj.proxy,
    };
  } else {
    obj = {
      // Open the site in Chrome & Firefox
      //browser: ["google chrome", "firefox"],
      // Wait for 0.15 seconds before any browsers should try to inject/reload a file.
      //reloadDelay: 150,
      // Don't show any notifications in the browser.
      notify: true,
      port: 3000,
      //server: "temp"
      server: {
        //directory: true,
        index: initObj.index || "index.html",
        baseDir: initObj.baseDir || "examples/temp",
      },
    };
  }
  for (key in initObj) {
    if (initObj.hasOwnProperty(key)) {
      obj[key] = initObj[key];
    }
  }
  browserSync.init(obj);
};
