({
    /* 
    * Build config to optimize one file, spoke.js
    */
    baseUrl: 'lib/js',

    
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

    /* The file to optimize */
    name: 'spoke',
    /* The optimized output file */
    out: 'spoke.min.js',

})