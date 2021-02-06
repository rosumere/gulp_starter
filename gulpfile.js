const { src, dest, parallel, series, watch } = require("gulp");
const del = require("del");
const autoprefixer = require("gulp-autoprefixer");
const gcmq = require("gulp-group-css-media-queries");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const gulpif = require("gulp-if");
const notify = require("gulp-notify");
const svgSprite = require("gulp-svg-sprite");
const htmlmin = require("gulp-htmlmin");

let isProd = false;

function clean() {
  return del(["build/*"]);
}
exports.clean = clean;

function html() {
  return src("./src/*.html")
    .pipe(gulpif(isProd, htmlmin({ collapseWhitespace: true })))
    .pipe(dest("./build"))
    .pipe(browserSync.stream());
}
exports.html = html;

function styles() {
  return src("./src/assets/sass/style.scss")
    .pipe(gulpif(!isProd, sourcemaps.init()))
    .pipe(sass().on("error", notify.onError()))
    .pipe(gulpif(isProd, gcmq()))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({ level: 1 }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulpif(!isProd, sourcemaps.write(".")))
    .pipe(dest("./build/assets/css/"))
    .pipe(browserSync.stream());
}
exports.styles = styles;

function svgSprites() {
  return src("./src/assets/img/svg/sprites/**.svg")
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest("./build/assets/img/svg/"));
}
exports.svgSprites = svgSprites;

const watching = () => {
  browserSync.init({
    server: {
      baseDir: "./build",
    },
  });
  watch("./src/*.html", html);
  watch("./src/assets/sass/**/*.scss", styles);
  watch("./src/assets/img/svg/sprites/**.svg", svgSprites);
};

exports.default = series(clean, styles, svgSprites, html, watching);
