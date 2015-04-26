# spoke-client
Spoke client-side library for speech recognition and audio tools

Spoke uses [Require.js](http://requirejs.org/) to explicitly manage its module dependencies, and it uses [r.js](https://github.com/jrburke/r.js) to build and optimize itself for production.
The built file [spoke.min.js](./spoke.min.js) can be loaded into your own javascript code using Require.js. 

### A word about Require.js
Using Require.js for your own js project is highly recommended: it is great for explicitly listing your dependencies, and then it handles the asynchronous loading and execution of your file tree. It also handles smoothly configuring a fallback for third-party libraries you would normally load over CDN. Last but not least, with loader plugins you can also use it to require as dependencies non-Javascript assets, like text. This is especially helpful when using a templating library, since you might break up your page into many small html snippets that are reusable and that need to be loaded asynchronously onto your page. This text loader plugin can also be used with building and optimizing the Require.js code before deployment.

## Using spoke-client in your own project
### If you are using Node and npm
```sh
$ npm install spoke-client --save
```
or [see how you can use github urls](https://docs.npmjs.com/files/package.json#github-urls)
```sh
$ npm install --save psaylor/spoke-client
```
This will install spoke-client under `node_modules/` and keep track of your dependency on this project in `package.json`.
The most recent javascript and css libraries are compiled and minified for you in the root of the project. The javascript library is currently only compatible with Require.js AMD module loading, so you should create your own `main.js` to load into your HTML and which will contain a dependency on the spoke client library (an example of this can be seen in test/). For example,
```html
<!-- index.html -->
...
<script src="path/to/require.js" data-main="main.js"></script>
...
```
```javascript
// main.js
require.config({
    paths: {
      'spoke': 'path/to/spoke.min',
    },
});

require(['spoke', 'otherDep1', 'otherDep2'], function (spoke, dep1, dep2) {
  /* Your js code using Spoke here */
});
```
Inside your main.js you can include Spoke in a few ways:

* reference the full path of its location, which is under the spoke-client module `your_project_dir/node_modules/spoke-client/spoke.min.js` (so you will probably have to go up a couple directories and then back down, and don't forget to take off .js for the require.config path)
```javascript
paths: {
  'spoke': '../../node_modules/spoke-client/spoke.min',
},
```
* Copy it into the same directory as your `main.js`, so then the path you configure could just be a shortened name
```javascript
paths: {
  'spoke': './spoke.min',
},
```
* (PREFERRED) Softlink it into the same directory as your `main.js`, so when you update spoke-client, the softlink automatically gets updated.
```bash
$ cd my_javascript_dir
$ ls
main.js (and other stuff)
# change the relative path as necessary
$ ln -s ../../node_modules/spoke-client/spoke.min.js ./spoke.min.js
```
```javascript
paths: {
  'spoke': './spoke.min',
},
```

## Developing on this library
You should have Node and npm installed already to start development. Then you can install the requirejs project through npm, either following [their own guide](http://requirejs.org/docs/optimization.html) or the short version of it here:
Setup requirejs globally so the r.js optimizer will be on your path automatically
```
$ npm install -g requirejs
```
or
```
$ sudo npm install -g requirejs
```
Or install it locally under your current project working directory
```
$ npm install requirejs
```
Now you will find r.js located at project_dir/node_modules/requirejs/bin/r.js

After you make changes and are ready to commit a new version, you should run all the builds to provide ready-to-go code to other developers:
```
$ cd spoke-client/
$ r.js -o buildSpoke.js 

Tracing dependencies for: spoke
Uglifying file: /Users/patriciasaylor/Documents/code/spoke-client/spoke.min.js

/Users/patriciasaylor/Documents/code/spoke-client/spoke.min.js
----------------
/Users/patriciasaylor/Documents/code/spoke-client/lib/js/third-party/socket.io-stream.js
/Users/patriciasaylor/Documents/code/spoke-client/lib/js/clientSocket.js
/Users/patriciasaylor/Documents/code/spoke-client/lib/js/crossBrowserAudio.js
/Users/patriciasaylor/Documents/code/spoke-client/lib/js/sharedAudio.js
/Users/patriciasaylor/Documents/code/spoke-client/lib/js/utils.js
/Users/patriciasaylor/Documents/code/spoke-client/lib/js/microphone.js
/Users/patriciasaylor/Documents/code/spoke-client/lib/js/player.js
/Users/patriciasaylor/Documents/code/spoke-client/lib/js/recognizer.js
/Users/patriciasaylor/Documents/code/spoke-client/lib/js/recorder.js
/Users/patriciasaylor/Documents/code/spoke-client/lib/js/spoke.js
```
```
$ cd spoke-client
$ r.js -o buildCss.js

/Users/patriciasaylor/Documents/code/spoke-client/spoke.min.css
----------------
/Users/patriciasaylor/Documents/code/spoke-client/lib/css/general.css
/Users/patriciasaylor/Documents/code/spoke-client/lib/css/micIcon.css
/Users/patriciasaylor/Documents/code/spoke-client/lib/css/spoke.css
```
```
$ cd spoke-client
$  r.js -o buildAll.js 
Optimizing (standard) CSS file: /Users/patriciasaylor/Documents/code/spoke-client/build/css/general.css
Optimizing (standard) CSS file: /Users/patriciasaylor/Documents/code/spoke-client/build/css/micIcon.css
Optimizing (standard) CSS file: /Users/patriciasaylor/Documents/code/spoke-client/build/css/spoke.css
Uglifying file: /Users/patriciasaylor/Documents/code/spoke-client/build/js/clientSocket.js
Uglifying file: /Users/patriciasaylor/Documents/code/spoke-client/build/js/crossBrowserAudio.js
Uglifying file: /Users/patriciasaylor/Documents/code/spoke-client/build/js/microphone.js
Uglifying file: /Users/patriciasaylor/Documents/code/spoke-client/build/js/player.js
Uglifying file: /Users/patriciasaylor/Documents/code/spoke-client/build/js/recognizer.js
Uglifying file: /Users/patriciasaylor/Documents/code/spoke-client/build/js/recorder.js
Uglifying file: /Users/patriciasaylor/Documents/code/spoke-client/build/js/sharedAudio.js
Uglifying file: /Users/patriciasaylor/Documents/code/spoke-client/build/js/spoke.js
Uglifying file: /Users/patriciasaylor/Documents/code/spoke-client/build/js/utils.js

css/general.css
----------------
css/general.css

css/micIcon.css
----------------
css/micIcon.css

css/spoke.css
----------------
css/general.css
css/micIcon.css
css/spoke.css
```

All of these build options can be overriden by command line params. Putting them in a build profile saves the headache with command line params every time. 

Also note that for spoke.js, the module loader needs to be `define` not `require` in order for that module to return references to all the other modules. Otherwise, with `require` it returns undefined.

### Notes
These guides were useful for making a standalone library using Requirejs,
* http://spadgos.github.io/blog/2013/10/19/using-requirejs-and-make-for-standalone-libraries/
though it takes the route of pre-compiling all the dependencies into one file
and then loading it using almond (a 1KB subset of the requirejs API that only
works for pre-compiled optimized require.js file)
* http://tech.pro/blog/1639/using-rjs-to-optimize-your-requirejs-project
* http://orizens.com/wp/topics/requirejs-optimizing-and-building-one-file/
* http://www.sitepoint.com/building-library-with-requirejs/
* Loading css? http://requirejs.org/docs/faq-advanced.html#css


