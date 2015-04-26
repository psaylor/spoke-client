# spoke-client
Spoke client-side library for audio and speech recognition

Require.js is great for explicitly listing your dependencies, and then handles
asynchronous loading and execution of your file tree. It also handles smoothly
configuring a fallback for third-party libraries you would normally load over
CDN. Last but not least, with loader plugins you can also use it to require as
dependencies non-Javascript assets, like text. This is especially helpful when
using a templating library, since you might break up your page into many small
html snippets that are reusable and that need to be loaded asynchronously onto
your page. This text loader plugin can also be used with building and optimizing
the Require.js code before deployment.

Can follow this guide for making a standalone library using Requirejs,
http://spadgos.github.io/blog/2013/10/19/using-requirejs-and-make-for-standalone-libraries/
though it takes the route of pre-compiling all the dependencies into one file
and then loading it using almond (a 1KB subset of the requirejs API that only
works for pre-compiled optimized require.js file)

To develop on this library:
Setup requirejs: http://requirejs.org/docs/optimization.html
> npm install -g requirejs
or
> sudo npm install -g requirejs
Now the optimizer script will be globally available to you.
> r.js -o app.build.js

For local install,
> npm install requirejs
now find r.js located at project_dir/node_modules/requirejs/bin/r.js

Save the headache with command line params by putting a build profile in build.js

Getting Error:
529 patriciasaylor:spoke-client$ r.js -o build.js 
Optimizing (standard.keepLines.keepWhitespace) CSS file: /Users/patriciasaylor/Documents/code/spoke-client/build/lib/css/micIcon.css
Optimizing (standard.keepLines.keepWhitespace) CSS file: /Users/patriciasaylor/Documents/code/spoke-client/build/lib/css/style.css
Optimizing (standard.keepLines.keepWhitespace) CSS file: /Users/patriciasaylor/Documents/code/spoke-client/build/node_modules/socket.io/node_modules/engine.io/node_modules/engine.io-parser/node_modules/utf8/coverage/prettify.css
Optimizing (standard.keepLines.keepWhitespace) CSS file: /Users/patriciasaylor/Documents/code/spoke-client/build/node_modules/socket.io/node_modules/socket.io-adapter/node_modules/socket.io-parser/node_modules/json3/coverage/lcov-report/prettify.css
Optimizing (standard.keepLines.keepWhitespace) CSS file: /Users/patriciasaylor/Documents/code/spoke-client/build/node_modules/socket.io/node_modules/socket.io-parser/node_modules/json3/coverage/lcov-report/prettify.css
Optimizing (standard.keepLines.keepWhitespace) CSS file: /Users/patriciasaylor/Documents/code/spoke-client/build/node_modules/socket.io-client/node_modules/engine.io-client/node_modules/engine.io-parser/node_modules/utf8/coverage/prettify.css
Optimizing (standard.keepLines.keepWhitespace) CSS file: /Users/patriciasaylor/Documents/code/spoke-client/build/node_modules/socket.io-client/node_modules/engine.io-client/node_modules/has-cors/node_modules/global/test/mocha.css
Optimizing (standard.keepLines.keepWhitespace) CSS file: /Users/patriciasaylor/Documents/code/spoke-client/build/node_modules/socket.io-client/node_modules/socket.io-parser/node_modules/json3/coverage/lcov-report/prettify.css

Tracing dependencies for: js/spoke
Error: ENOENT, no such file or directory '/Users/patriciasaylor/Documents/code/spoke-client/build/lib/crossBrowserAudio.js'
In module tree:
    js/spoke

Error: Error: ENOENT, no such file or directory '/Users/patriciasaylor/Documents/code/spoke-client/build/lib/crossBrowserAudio.js'
In module tree:
    js/spoke

    at Error (native)

Try to fix by adding baseUrl: 'js/' to lib/js/spoke.js

Have to make spoke.js main module loader into define instead of require?
Yes, otherwise when you require it in another module you get undefined
even though it is returning something...odd
