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