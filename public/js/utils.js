define(['jquery'], function($) {
    var utils = {};
    
    utils.normalizeString = function (string){
        var punctuationRegex = /[.,?""''-;:]/g;
        var normalized = string.replace(punctuationRegex, '');
        normalized = normalized.toLowerCase();
        return normalized;
    };

    utils.addGlobalVariable = function (key, value) {
        if (window.GLOB) {
            window.GLOB[key] = value;
        } else {
            window.GLOB = {};
            window.GLOB[key] = value;
        }
    };

    return utils;
});
