({
    /* 
    * Build config to optimize the whole project in lib
    */
    appDir: 'lib',
    baseUrl: 'js',

    /* 
     Load require.config from the main file specified here
     but override CDN libraries with empty:
    */
    mainConfigFile: 'lib/js/spoke.js',
    paths: {
        jquery: 'empty:',
        ractive: 'empty:',
        modernizr: 'empty:',
        socketio: 'empty:',
        promise: 'empty:',
    },
    optimizeCss: "standard",

    /* The directory to put all the built files in */
    dir: 'build',
    fileExclusionRegExp: /third-party/,

})