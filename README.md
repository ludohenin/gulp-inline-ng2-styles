# Moved to gulp-inline-ng2-template

> see [gulp-inline-ng2-template](https://github.com/ludohenin/gulp-inline-ng2-template)

This feature (style sheets inlining) as been implemented in plugin gulp-inline-ng2-template.

***
***
***

# gulp-inline-ng2-styles

Inline Angular2 components style sheets into JavaScript ES5/ES6 and TypeScript files (and possibly more - not tested).
This plugin uses the [ES6 template strings](https://github.com/lukehoban/es6features#template-strings) syntax by default _(which requires the use of a transpiler -typescript, babel, traceur- to produce valid ES5 files)_ but you can opt-in for ES5 one.

This is very convenient to bundle your components/application (avoid extra HTTP request and keeps your source clean).

__You may also check out:__ [gulp-inline-ng2-template](https://github.com/ludohenin/gulp-inline-ng2-template)

# Installation

```bash
npm install gulp-inline-ng2-styles --save-dev
```

# Configuration

You can pass a configuration object to the plugin.
```javascript
defaults = {
  base: '/',          // Angular2 application base folder
  extension: '.css',  // Template file extension
  target: 'es6'       // Can swap to es5
};
```

# Example usage

```javascript
//...
var inlineNg2Styles = require('gulp-inline-ng2-styles');

var result = gulp.src('./app/**/*ts')
  .pipe(inlineNg2Styles({ base: '/app' }))
  .pipe(tsc());

return result.js
  .pipe(gulp.dest(PATH.dest));
```

# How it works

__hello.css__
```css
.hello {
  background-color: #000000;
}
```

__component.ts__
```javascript
import {Component, View} from 'angular2/angular2';
@Component({ selector: 'hello' })
@View({
  templateUrl: './template.html',
  styleUrls: ['app.css']
})
class Hello {}
```

__result (component.ts)__
```javascript
import {Component, View} from 'angular2/angular2';
@Component({ selector: 'hello' })
@View({
  templateUrl: './template.html',
  styles: [`
    .hello {
      background-color: #000000;
    }
  `]
})
class Hello {}
```

# Licence

MIT
