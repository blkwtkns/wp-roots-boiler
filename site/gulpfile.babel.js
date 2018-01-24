import gulp from 'gulp';
import gutil from 'gulp-util';
import fileinclude from 'gulp-file-include';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import cacheBuster from 'gulp-cache-bust';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';

// import BrowserSync from 'browser-sync';
import runSequence from 'run-sequence';

import webpack from 'webpack';
import webpackConfig from './webpack.conf';

// const browserSync = BrowserSync.create();

// location of static files to copy over
// everything but markup, scripts, and styles directories
const staticFiles = [
  'src/**/*.*',
  '!src/scripts{,/**}',
  '!src/styles{,/**}'
];

// Styles
// ------------------------------------------------------- //
gulp.task('styles', () => (
  gulp.src('src/styles/**/*.scss')
    .pipe(plumber({ errorHandle: reportError }))
    // Load existing internal sourcemap
    .pipe(sourcemaps.init())
    // generate CSS from SASS
    .pipe(sass({ outputStyle: 'compressed' }))
    // catch any errors
    .on('error', reportError)
    // autoprefix code. Check browserslist in package.json for settings
    .pipe(postcss([autoprefixer()]))
    // Write final .map file
    .pipe(sourcemaps.write())
    // output files
    .pipe(gulp.dest('./web/app/themes/dist/css'))
    // update browserSync
    // .pipe(browserSync.stream())
));

// Scripts
// ------------------------------------------------------- //
gulp.task('scripts', (callback) => {
  // use webpack to transpile
  webpack(webpackConfig, (err, stats) => {
    // TODO: find a way to keep gulp running after error
    if (err) {
      reportError(err);
      throw new gutil.PluginError('webpack', err);
    }

    // log webpack output to terminal
    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }));

    // reload browserSync
    // browserSync.reload();

    callback();
  });
});

// Static
// ------------------------------------------------------- //
// copy static files (data, docs, fonts, and images) over to `dist` directory
gulp.task('static', () => (
  gulp.src(staticFiles, { base: 'src/' })
    // output files
    .pipe(gulp.dest('./web/app/themes/dist'))
    // update browserSync
    // .pipe(browserSync.stream())
));

// Bust Cache
// ------------------------------------------------------- //
// gulp.task('cacheBuster', () => (
//   gulp.src('dist/*.html')
//     .pipe(cacheBuster())
//     // catch any errors
//     .on('error', reportError)
//     // output files
//     .pipe(gulp.dest('./dist'))
// ));

// Dev
// ------------------------------------------------------- //
// Transpile HTML, CSS, and Javascript
// Watch for changes
gulp.task('dev', ['static', 'styles', 'scripts'], () => {
  // Start BrowserSync
  // browserSync.init({
  //   files: ['src/**/*.php', '*.php'],
  //   proxy: 'http://kaa.dev',
  //   snippetOptions: {
  //     whitelist: ['/wp-admin/admin-ajax.php'],
  //     blacklist: ['/wp-admin/**']
  //   }
  // });
  // Watch for changes and run matching task
  gulp.watch(['src/*.html', 'src/markup/**/*.*'], ['html']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch(staticFiles, { base: 'src/' }, ['static']);
  // notify
  notify().write({
    message: 'Development mode engaged',
  });
});

// Build
// ------------------------------------------------------- //
// Transpile HTML, CSS, and Javascript
// Move static files
// Bust cache
gulp.task('build', cb =>
  runSequence(['static', 'styles', 'scripts'], cb)
);

// Errors
// ------------------------------------------------------- //
// https://github.com/mikaelbr/gulp-notify/issues/81
const reportError = function (error) {
  const lineNumber = (error.lineNumber) ? `LINE ${error.lineNumber} -- ` : '';

  notify({
    title: `Task Failed [${error.plugin}]`,
    message: `${lineNumber} See console.`,
    sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  }).write(error);

  gutil.beep(); // Beep 'sosumi' again

  // Inspect the error object
  // console.log(error);

  // Easy error reporting
  // console.log(error.toString());

  // Pretty error reporting
  let report = '';
  const chalk = gutil.colors.white.bgRed;

  report += `${chalk('TASK:')} [${error.plugin}]\n`;
  report += `${chalk('PROB:')} ${error.message}\n`;
  if (error.lineNumber) { report += `${chalk('LINE:')} ${error.lineNumber}\n`; }
  if (error.fileName) { report += `${chalk('FILE:')} ${error.fileName}\n`; }
  console.error(report);

  // Prevent the 'watch' task from stopping
  this.emit('end');
};
