var gulp = require('gulp');
var i18next = require('aurelia-i18next-parser');
var paths = require('../paths');

console.log(i18next);

gulp.task('i18n', function() {
    gulp.src(paths.root + '**/*')
        .pipe(i18next.i18next({
            routesModuleId: "app",          //module to extract routes from
            appPath: "src",                    //path to the aurelia application files relative from the gulpfile
            locales: ['en', 'de'],             //translation files will be created for these
            defaultLocale: 'en',               //this will be treated as the default locale, the extracted values will not be transformed for this locale
            translation_attribute:"i18n",      //attribute that is used in the html to specify translation keys
            functions:['t'],                   //function that is used in javascript to translate values
            defaultNamespace:'translation'
        }))
        .pipe(gulp.dest(paths.locale));
});
