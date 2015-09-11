"use strict";
var assert = require('assert');
var extend = require('extend');
var inline = require('../');
var File = require('vinyl');

var inlinerOptions = {
  base: '/test/fixtures'
};

describe('gulp-inline-ng2-styles', function () {

  it('should inline a single style sheet', function (done) {
    var result = "styles: [`.test {\n  color: red;\n}`]";
    var jsFile = new File({
      contents: new Buffer("styleUrls: ['./style.css']")
    });

    var stream = inline(inlinerOptions);
    stream.write(jsFile);
    stream.once('data', function(file) {
      assert.equal(file.contents.toString(), result);
      done();
    });
  });

  it('should inline multiple style sheets', function (done) {
    var result = "styles: [`.test {\n  color: red;\n}`, `.test2 {\n  color: green;\n}`]";
    var jsFile = new File({
      contents: new Buffer("styleUrls: ['./style.css', 'style2.css']")
    });

    var stream = inline(inlinerOptions);
    stream.write(jsFile);
    stream.once('data', function(file) {
      assert.equal(file.contents.toString(), result);
      done();
    });
  });

  it('should inline multiple line array style', function (done) {
    var result = "styles: [`.test {\n  color: red;\n}`, `.test2 {\n  color: green;\n}`]";
    var jsFile = new File({
      contents: new Buffer("styleUrls: [\n  './style.css',\n  'style2.css'\n]")
    });

    var stream = inline(inlinerOptions);
    stream.write(jsFile);
    stream.once('data', function(file) {
      assert.equal(file.contents.toString(), result);
      done();
    });
  });

  it('should work with trailing coma', function (done) {
    var result = "styles: [`.test {\n  color: red;\n}`, `.test2 {\n  color: green;\n}`],";
    var jsFile = new File({
      contents: new Buffer("styleUrls: [\n  './style.css',\n  'style2.css'\n],")
    });

    var stream = inline(inlinerOptions);
    stream.write(jsFile);
    stream.once('data', function(file) {
      assert.equal(file.contents.toString(), result);
      done();
    });
  });

  it('should work with one-liner', function (done) {
    var result = "@View({ styles: [`.test {\n  color: red;\n}`, `.test2 {\n  color: green;\n}`], directives: [NgIf] })";
    var jsFile = new File({
      contents: new Buffer("@View({ styleUrls: ['./style.css', 'style2.css'], directives: [NgIf] })")
    });

    var stream = inline(inlinerOptions);
    stream.write(jsFile);
    stream.once('data', function(file) {
      assert.equal(file.contents.toString(), result);
      done();
    });
  });

  it('should work with one-liner in multiple line file', function (done) {
    var result = "var x = [1,2];\n@Component({ selector: 'app' })\n@View({ styles: [`.test {\n  color: red;\n}`, `.test2 {\n  color: green;\n}`], directives: [NgIf] })\nexport class App {}";
    var jsFile = new File({
      contents: new Buffer("var x = [1,2];\n@Component({ selector: 'app' })\n@View({ styleUrls: ['./style.css', 'style2.css'], directives: [NgIf] })\nexport class App {}")
    });

    var stream = inline(inlinerOptions);
    stream.write(jsFile);
    stream.once('data', function(file) {
      assert.equal(file.contents.toString(), result);
      done();
    });
  });

  it('should work with more options', function (done) {
    var result = "@View({\n  styles: [`.test {\n  color: red;\n}`, `.test2 {\n  color: green;\n}`],\n  directives: [NgIf]\n})";
    var jsFile = new File({
      contents: new Buffer("@View({\n  styleUrls: [\n  './style.css',\n  'style2.css'\n],\n  directives: [NgIf]\n})")
    });

    var stream = inline(inlinerOptions);
    stream.write(jsFile);
    stream.once('data', function(file) {
      assert.equal(file.contents.toString(), result);
      done();
    });
  });

  it('should work with es5 mode', function (done) {
    var result = '@View({\n  styles: [".test {\\n  color: red;\\n}", ".test2 {\\n  color: green;\\n}"],\n  directives: [NgIf]\n})';
    var jsFile = new File({
      contents: new Buffer("@View({\n  styleUrls: [\n  './style.css',\n  'style2.css'\n],\n  directives: [NgIf]\n})")
    });

    var options = extend({}, inlinerOptions, {target: 'es5'});

    var stream = inline(options);
    stream.write(jsFile);
    stream.once('data', function(file) {
      assert.equal(file.contents.toString(), result);
      done();
    });
  });

});
