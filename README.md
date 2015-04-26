# spoke-client
Spoke client-side library for speech recognition and audio tools

Spoke uses [Require.js](http://requirejs.org/) to explicitly manage its module dependencies, and it uses [r.js](https://github.com/jrburke/r.js) to build and optimize itself for production.
The built file [spoke.min.js](./spoke.min.js) can be loaded into your own javascript code using Require.js. 

A word about Require.js
Using Require.js for your own js project is highly recommended: it is great for explicitly listing your dependencies, and then it handles the asynchronous loading and execution of your file tree. It also handles smoothly configuring a fallback for third-party libraries you would normally load over CDN. Last but not least, with loader plugins you can also use it to require as dependencies non-Javascript assets, like text. This is especially helpful when using a templating library, since you might break up your page into many small html snippets that are reusable and that need to be loaded asynchronously onto your page. This text loader plugin can also be used with building and optimizing the Require.js code before deployment.

Notes
====
These guides were useful for making a standalone library using Requirejs,
* http://spadgos.github.io/blog/2013/10/19/using-requirejs-and-make-for-standalone-libraries/
though it takes the route of pre-compiling all the dependencies into one file
and then loading it using almond (a 1KB subset of the requirejs API that only
works for pre-compiled optimized require.js file)
* http://tech.pro/blog/1639/using-rjs-to-optimize-your-requirejs-project
* http://orizens.com/wp/topics/requirejs-optimizing-and-building-one-file/
* http://www.sitepoint.com/building-library-with-requirejs/
* Loading css? http://requirejs.org/docs/faq-advanced.html#css

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

Other guides to setting up compiling and dist:


Have to make spoke.js main module loader into define instead of require?
Yes, otherwise when you require it in another module you get undefined
even though it is returning something...odd
