/**
 * GULP DCO BUILDER TOOL
 * AUTHOR: J. Pfeifer (c) 2020-2022
 * LICENSE: GNU GENERAL PUBLIC LICENSE
 */
const { watch, series, parallel, src, dest } = require("gulp");
// npm i autoprefixer browser-sync gulp gulp-cache gulp-clean-css gulp-concat gulp-html-replace gulp-if gulp-imagemin gulp-postcss gulp-rename gulp-remove-logging gulp-sass gulp-uglify uglify-save-license

const gulpif = require("gulp-if");
const concat = require("gulp-concat");
const removeLogging = require("gulp-remove-logging");
const uglify = require("gulp-uglify");
const saveLicense = require("uglify-save-license");
//const data = require('gulp-data');
//const path = require("path");
const htmlReplace = require("gulp-html-replace");
const rename = require("gulp-rename");
//const tap = require('gulp-tap');
//const through = require('through2');
const {
  cleanDir,
  moveFiles,
  buildCssFromScss,
  handleJS,
  watchBrowser,
} = require("./gulp-dco-utils");

//const htdocsPath = '/Applications/MAMP/htdocs/';
const srcPath = "./src/";
const devFolder = "_temp/";
const testFolder = "_test/";
const buildFolder = "_build/";
const buildFolderInline = "_build_inline/";
const buildFolderStd = "_build_std/";

const TPL_DCO_NAME_LOCAL = "TPL_DCO_LOCAL_211101";
//TPL_DE_DCO
const tplNamesTPL_DE_DCO = ["TPL_DCO_300x600_211101_DE"];
const tplNamesTPL_FR_DCO = ["TPL_DCO_300x600_211101_FR"];
const tplNamesTPL_IT_DCO = ["TPL_DCO_300x600_211101_IT"];
const tplNamesTPL_DCO = ["TPL_DCO_300x600_211101"];

let currentTplIndex = 0;
let tplNameLang = "";
let tplName = "";
let config = {};
let tplNamesLang = [];
let tplNames = [];

const print = (cb) => {
  console.log("->", tplNameLang);
  cb();
};

const initCurrentTplIndex = (cb) => {
  currentTplIndex = 0;
  cb();
};

const initTplNamesTPL_DE_DCO = (cb) => {
  tplNamesLang = tplNamesTPL_DE_DCO;
  tplNames = tplNamesTPL_DCO;
  cb();
};
const initTplNamesTPL_FR_DCO = (cb) => {
  tplNamesLang = tplNamesTPL_FR_DCO;
  tplNames = tplNamesTPL_DCO;
  cb();
};
const initTplNamesTPL_IT_DCO = (cb) => {
  tplNamesLang = tplNamesTPL_IT_DCO;
  tplNames = tplNamesTPL_DCO;
  cb();
};

const nextConfig = (cb) => {
  tplNameLang = tplNamesLang[currentTplIndex];
  tplName = tplNames[currentTplIndex++];
  config = {
    DEVELOPMENT: true,
    PATH_INCLUDES_SASS: ["bower_components/juiced/sass/"],
    SRC_DATA: [srcPath + "tpl/js/" + tplNameLang + "_SHEET.js"],
    SRC_IMAGES: [srcPath + "tpl/img/**"],
    SRC_TPL_HTML: [srcPath + "tpl/html/" + tplName + ".html"],
    SRC_TPL_SASS: [srcPath + "tpl/scss/" + tplName + ".scss"],
    SRC_TPL_JS_SHEET: [
      srcPath + "js/egplus-html5-slim-3.2.1.min.js",
      srcPath + "js/ad-timeline-control-2.1.0.min.js",
      srcPath + "tpl/js/" + TPL_DCO_NAME_LOCAL + ".js",
      srcPath + "tpl/js/" + tplNameLang + "_DATA.js",
      srcPath + "tpl/js/" + tplNameLang + "_SHEET.js",
      srcPath + "js/egplus-feed-temp.js",
      srcPath + "js/egplus-html-enabler.js",
    ],
    SRC_TPL_JS_SHEET_LIVE: [
      srcPath + "js/egplus-html5-slim-3.2.1.js",
      srcPath + "tpl/js/" + tplNameLang + "_DATA.js",
      srcPath + "js/egplus-feed-build.js",
      srcPath + "js/egplus-html-enabler.js",
    ],
    SRC_TPL_JS_SHEET_TEST: [
      srcPath + "js/egplus-html5-slim-3.2.1.js",
      srcPath + "js/egplus-html-enabler-test.js",
    ],
    SRC_TPL_JS_ANIM: [
      srcPath + "js/ad-split-text-2.1.0.min.js",
      srcPath + "tpl/js/" + tplName + "_ANIM.js",
    ],
    SRC_TPL_JS_ANIM_LIVE: [
      srcPath + "js/ad-split-text-2.1.0.js",
      srcPath + "tpl/js/" + tplName + "_ANIM.js",
    ],
    DEST_TEMP: devFolder + tplNameLang,
    DEST_TEST: testFolder + tplNameLang,
    DEST_BUILD: buildFolder + tplNameLang,
    DEST_BUILD_INLINE: buildFolderInline + tplNameLang,
    DEST_STD: buildFolderStd + tplNameLang,
  };
  cb();
};

const enableDevelopment = (cb) => {
  config.DEVELOPMENT = true;
  cb();
};

const enableProduction = (cb) => {
  config.DEVELOPMENT = false;
  cb();
};

const cleanDirectory = (cb) => {
  cleanDir([config.DEST_STD + "/**", "!" + config.DEST_STD], true);
  cleanDir(
    [config.DEST_BUILD_INLINE + "/**", "!" + config.DEST_BUILD_INLINE],
    true
  );
  cleanDir([config.DEST_TEMP + "/**", "!" + config.DEST_TEMP], true);
  cleanDir([config.DEST_BUILD + "/**", "!" + config.DEST_BUILD], true);
  cb();
};

const handleImages = (cb) => {
  //return handleImages(config, null, true);
  //return handleImages(config, config.DEVELOPMENT ? config.DEST_TEMP + '/img/' : config.DEST_BUILD + '/img/');
  moveFiles(config.SRC_IMAGES, config.DEST_STD + "/img/");
  moveFiles(config.SRC_IMAGES, config.DEST_BUILD_INLINE + "/img/");
  moveFiles(config.SRC_IMAGES, config.DEST_TEMP + "/img/");
  return moveFiles(config.SRC_IMAGES, config.DEST_BUILD + "/img/");
};

//parallel(handleSass, handleFeedJS, handleAnimJS)
const handleSass = () => {
  //CSS_FILENAME
  return buildCssFromScss({
    SRC_SASS: config.SRC_TPL_SASS,
    CSS_FILENAME: tplName,
    DEST: config.DEVELOPMENT ? config.DEST_TEMP : config.DEST_BUILD,
    DEVELOPMENT: config.DEVELOPMENT,
  });
};
//unused at the moment
/* const handleFeedJS = () => {
     let sources = config.DEVELOPMENT ? config.SRC_TPL_JS_SHEET : config.SRC_TPL_JS_SHEET_LIVE;
     return handleJS({
         SRC_JS: sources,
         JS_FILENAME: 'egp-feet.min',
         DEST: config.DEVELOPMENT ? config.DEST_TEMP : config.DEST_BUILD,
         DEVELOPMENT: config.DEVELOPMENT
     });
 }; */

const handleAnimJS = () => {
  //
  return handleJS({
    SRC_JS: config.DEVELOPMENT
      ? config.SRC_TPL_JS_ANIM
      : config.SRC_TPL_JS_ANIM_LIVE,
    JS_FILENAME: tplName + "_ANIM",
    DEST: config.DEVELOPMENT ? config.DEST_TEMP : config.DEST_BUILD,
    DEVELOPMENT: config.DEVELOPMENT,
  });
};

const writeSheetToData = () => {
  return handleJS({
    SRC_JS: config.SRC_DATA,
    JS_FILENAME: "data",
    DEST: config.DEST_STD,
    DEVELOPMENT: true,
  });
};

const getCombinedJS = (sources, name, minified) => {
  if (typeof minified !== "boolean") {
    minified = true;
  }
  //console.log('DEVELOPMENT:'), config.DEVELOPMENT, "minified:", minified);
  //gulpif(minified, removeLogging({}))
  return src(sources)
    .pipe(concat("index." + name + ".js"))
    .pipe(
      gulpif(
        minified,
        removeLogging({
          methods: ["log", "info"],
        })
      )
    )
    .pipe(
      gulpif(
        minified,
        uglify({
          output: {
            comments: saveLicense,
          },
        })
      )
    );
  //.pipe(dest(config.DEST_STD));
};

const handleHtml = () => {
  let sources = config.DEVELOPMENT
    ? config.SRC_TPL_JS_SHEET
    : config.SRC_TPL_JS_SHEET_LIVE;
  return src(config.SRC_TPL_HTML)
    .pipe(
      htmlReplace({
        //tempFeedData: './data.js',
        jsInline: {
          src: getCombinedJS(sources, "min", !config.DEVELOPMENT),
          tpl: "<script>%s</script>",
        },
      })
    )
    .pipe(rename("index.html"))
    .pipe(dest(config.DEVELOPMENT ? config.DEST_TEMP : config.DEST_BUILD));
  /* if (config.DEVELOPMENT) {
         return src(config.SRC_TPL_HTML)
             .pipe(htmlReplace({
                 //tempFeedData: './data.js',
                 jsInline: {
                     src: getCombinedJS(sources, 'min', config.DEVELOPMENT),
                     tpl: '<script>%s</script>'
                 }
             }))
             .pipe(rename('index.html'))
             .pipe(dest(config.DEVELOPMENT ? config.DEST_TEMP : config.DEST_BUILD));
     } else {
         return src(config.SRC_TPL_HTML)
             .pipe(htmlReplace({
                 jsInline: {
                     src: getCombinedJS(sources, 'min', config.DEVELOPMENT),
                     tpl: '<script>%s</script>'
                 }
             }))
             .pipe(rename('index.html'))
             .pipe(dest(config.DEVELOPMENT ? config.DEST_TEMP : config.DEST_BUILD));
     } */
};

const handleHtmlTest = () => {
  return src(config.SRC_TPL_HTML)
    .pipe(
      htmlReplace({
        //tempFeedData: './data.js',
        jsInline: {
          src: getCombinedJS(config.SRC_TPL_JS_SHEET_TEST, "min", true),
          tpl: "<script>%s</script>",
        },
      })
    )
    .pipe(rename("index.html"))
    .pipe(dest(config.DEST_TEST));
};

const handleHtmlStd = () => {
  let sourcesBefore = [
    srcPath + "js/egplus-html5-slim-2.4.0.js",
    srcPath + "tpl/js/" + TPL_DCO_NAME_LOCAL + ".js",
    srcPath + "tpl/js/" + tplNameLang + "_DATA.js",
  ];
  let sources = [
    ...config.SRC_TPL_JS_ANIM_LIVE,
    srcPath + "js/egplus-html-display.js",
  ];
  return src(config.SRC_TPL_HTML)
    .pipe(
      htmlReplace({
        cssInline: {
          src: src([config.DEST_BUILD + "/" + tplName + ".css"]),
          tpl: "<style>%s</style>",
        },
        jsInlineBefore: {
          src: getCombinedJS(sourcesBefore, "before"),
          tpl: "<script>%s</script>",
        },
        tempFeedData: "./data.js",
        jsInline: {
          src: getCombinedJS(sources, "min"),
          tpl: "<script>%s</script>",
        },
      })
    )
    .pipe(rename("index.html"))
    .pipe(dest(config.DEST_STD));
};

const handleHtmlBuildInline = () => {
  let sources = [
    srcPath + "js/egplus-html5-slim-2.4.0.js",
    srcPath + "tpl/js/" + tplNameLang + "_DATA.js",
    srcPath + "js/egplus-feed-build.js",
    ...config.SRC_TPL_JS_ANIM_LIVE,
    srcPath + "js/egplus-html-enabler.js",
  ];
  return src(config.SRC_TPL_HTML)
    .pipe(
      htmlReplace({
        cssInline: {
          src: src([config.DEST_BUILD + "/" + tplName + ".css"]),
          tpl: "<style>%s</style>",
        },
        jsInline: {
          src: getCombinedJS(sources, "min", true),
          tpl: "<script>%s</script>",
        },
      })
    )
    .pipe(rename("index.html"))
    .pipe(dest(config.DEST_BUILD_INLINE));
};

const watchDirectory = (cb) => {
  watchBrowser({
    proxy: false,
    baseDir: config.DEVELOPMENT ? config.DEST_TEMP : config.DEST_BUILD,
    index: "index.html",
  });
  //watchBrowser({ proxy: "http://localhost/" + buildFolder });
  watch(config.SRC_IMAGES, handleImages);
  watch(config.SRC_TPL_HTML, handleDefaultWatch);
  watch([srcPath + "tpl/scss/*.scss"], handleSass);
  //watch(config.SRC_TPL_JS_ANIM_LIVE, handleAnimJS);
  //watch(config.SRC_DATA, handleDataJSCH);
  watch([srcPath + "js/*.js", srcPath + "tpl/js/*.js"], handleDefaultWatch);
  //watch([srcPath + '*.*', srcPath + '**/*.*']).on('change', function (path, stats) { console.log('File:', path); });
  cb();
};

const handleDefaultWatch = series(
  enableProduction,
  parallel(handleSass, handleAnimJS),
  handleHtml,
  enableDevelopment,
  parallel(handleSass, handleAnimJS),
  handleHtml,
  writeSheetToData,
  handleHtmlStd,
  handleHtmlBuildInline,
  handleHtmlTest
);

const createNext = series(
  //initTplNamesTPL_DE_DCO,
  //initTplNamesTPL_FR_DCO,
  //initTplNamesTPL_IT_DCO,
  nextConfig,
  print,
  cleanDirectory,
  handleImages,
  handleDefaultWatch
);

const buildAll = series(
  initCurrentTplIndex,
  createNext
  //createNext,
);

exports.default = series(initTplNamesTPL_DE_DCO, createNext, watchDirectory);
exports.build = buildAll;
