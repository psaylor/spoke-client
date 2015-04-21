define(['jquery'], function($) {
    var utils = {};
    var PUNCTUATION_REGEX = /[.,?!";:@#$%^&*()]/g;
    
    /**
    * Normalizes a string by removing most punctuation and converting it to
    * lower case.
    */
    utils.normalizeString = function (string){
        var normalized = string.replace(PUNCTUATION_REGEX, '');
        normalized = normalized.toLowerCase();
        return normalized;
    };

    /**
    * Computes and returns the average of the values in a typed array, over the
    * entire array or over the range [fromIndex, toIndex)
    */
    utils.average = function(array, fromIndex, toIndex) {
        var valueSum = 0;

        var fromIndex = fromIndex || 0;
        var toIndex = toIndex || array.length;

        for (var i = fromIndex; i < toIndex; i++) {
            valueSum += array[i];
        }

        return valueSum / (toIndex - fromIndex);
    };

    /**
    * Adds a variable with name key and value value to a global object
    */
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
