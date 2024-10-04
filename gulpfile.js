const gulp = require('gulp');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const pug = require('gulp-pug');
const sass = require('sass');
const gulpSass = require('gulp-sass')(sass);
const sourcemaps = require('gulp-sourcemaps'); // Importar gulp-sourcemaps
const cleanCSS = require('gulp-clean-css'); // Importar gulp-clean-css
const tinify = require('gulp-tinify'); // Importar gulp-tinypng
const newer = require('gulp-newer'); // Importar gulp-newer

// Definir directorios
const directory = {
    source: 'src',
    dest: 'dist'
};

// Variables de ruta
const paths = {
    scss: {
        src: directory.source + '/scss/**/*.scss',
        dest: directory.dest + '/css'
    },
    js: {
        src: directory.source + '/js/**/*.js',
        dest: directory.dest + '/js'
    },
    pug: {
        views: [directory.source + '/pug/views/**/*.pug'],
        structure: [directory.source + '/pug/structure/**/*.pug'],
        includes: [directory.source + '/pug/includes/**/*.pug'],
        change: [directory.dest + '/*.html'],
        dest: directory.dest
    },
    fonts: {
        src: directory.source + '/fonts/**/*', // Ruta de las fuentes
        dest: directory.dest + '/fonts' // Ruta de destino de las fuentes
    },
    images: {
        src: directory.source + '/images/**/*', // Ruta de las imágenes
        dest: directory.dest + '/images' // Ruta de destino de las imágenes
    }
};

// Compilar y minificar Sass
function styles() {
    return gulp.src(paths.scss.src)
        .pipe(sourcemaps.init()) // Inicializar sourcemaps
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(cleanCSS()) // Minificar el CSS
        .pipe(rename('main.css')) // Cambiar el nombre a main.css
        .pipe(sourcemaps.write('.')) // Generar el archivo .map
        .pipe(gulp.dest(paths.scss.dest))
        .pipe(browserSync.stream());
}

// Minificar y renombrar JS
function scripts() {
    return gulp.src(paths.js.src)
        .pipe(sourcemaps.init()) // Inicializar sourcemaps
        .pipe(concat('main.js')) // Cambiar el nombre a main.js antes de minificar
        .pipe(uglify()) // Minificar el archivo
        .pipe(rename({ suffix: '.min' })) // Agregar sufijo .min
        .pipe(sourcemaps.write('.')) // Generar el archivo .map
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream());
}

// Compilar Pug
function templates() {
    return gulp.src(paths.pug.views)
        .pipe(pug())
        .pipe(gulp.dest(paths.pug.dest))
        .pipe(browserSync.stream());
}

// Copiar fuentes
function fontsTask() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
}

// Comprimir imágenes con TinyPNG
function imgTask() {
    return gulp.src(paths.images.src)
        .pipe(newer(paths.images.dest)) // Solo procesar imágenes nuevas
        .pipe(tinify('Z21qZlD7lr4MRVkieMTG4iptHj5Qahjr')) // API Key de TinyPNG
        .pipe(gulp.dest(paths.images.dest));
}

// Servir y recargar el navegador
function serve() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });

    gulp.watch(paths.scss.src, styles);
    gulp.watch(paths.js.src, scripts);
    gulp.watch(paths.pug.views, templates);
    gulp.watch(paths.pug.includes, templates);
    gulp.watch(paths.pug.structure, templates);
}

// Tareas por defecto
exports.default = gulp.series(gulp.parallel(styles, scripts, templates), serve);

// Exportar la tarea de fuentes
exports.fonts = fontsTask; // Ahora puedes ejecutar 'gulp fonts'

// Exportar la tarea de imágenes
exports.images = imgTask; // Ahora puedes ejecutar 'gulp images'
