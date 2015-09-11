"use strict";
var compile = require('es6-templates').compile;
var extend = require('extend');
var fs = require('fs');
var gutil = require('gulp-util');
var join = require('path').join;
var through = require('through2');

module.exports = exports = function (options) {
  var defaults = {
    base: '/',
    extension: '.css',
    target: 'es6'
  };

  options = extend({}, defaults, options || {});

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-ng2-inline-styles', 'Streaming not supported'));
      return;
    }

    try {
      file.contents = new Buffer(inline(file.contents.toString(), options));
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-ng2-inline-styles', err, {fileName: file.path}));
    }

    cb();
  });
};


var STYLE_URLS = 'styleUrls';
var STYLES = 'styles';

function inline(file, options) {
  var index1, index2, startLine, endLine, styleUrls;
  var lines = file.split('\n');
  var preffix = '';
  var suffix = '';

  lines.forEach(function (line, i) {
    index1 = line.indexOf(STYLE_URLS);
    index2 = line.indexOf(']');

    // Single line array definition
    if (index1 >= 0 && index2 > 0) {
      startLine = i;
      styleUrls = lines[i].slice(index1, index2 + 1);

      preffix = line.slice(0, index1);
      suffix = line.slice(index2 + 1);
      lines[i] = preffix + replace(styleUrls, options) + suffix;
    }

    // Multiple line array definition
    if (index1 >= 0 && index2) {
      startLine = i;
      preffix = line.slice(0, index1);
    }
    if (index2 >= 0 && index1 < 0 && startLine !== undefined) {
      endLine = i;
      var _lines = lines.splice(startLine, (i - startLine + 1));
      styleUrls = _lines.join('');

      lines.splice(startLine, 0, preffix + replace(styleUrls, options));
    }
  });

  return lines.join('\n');
}


// ----------------------
// Utils
function replace(styleUrls, options) {
  var styles = '';
  var urls = eval('({' + styleUrls + '}).styleUrls');

  urls.forEach(function (url, i) {
    var coma = i > 0 ? ', ' : '';
    styles += coma + getStylesString(url, options);
  });

  var newLines = STYLES + ': [' + styles + ']';
  newLines += hasTraillingComa(styleUrls) ? ',' : '';
  return newLines;
}

function getStylesString(stylesPath, options) {
  var stylesAbsPath = join(process.cwd(), options.base, stylesPath);
  var styles = fs.readFileSync(stylesAbsPath, 'utf8');
  var string =  '`' +
                trimTrailingLineBreak(styles) +
                '`';
  if (options.target === 'es5') {
    string = compile(string);
  }

  return string;
}

function trimTrailingLineBreak(styles) {
  var lines = styles.split('\n');
  // var trim = lines.splice(-1, 1);
  return (lines.pop() === '' ? lines.join('\n') : styles);
}

function hasTraillingComa(styleUrls) {
  return styleUrls.slice(-1) === ',' ? true : false;
}
