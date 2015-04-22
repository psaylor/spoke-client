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
    * Converts a buffer of Float32 values and returns a buffer of signed 16-bit
    * Integers.
    */
    utils.convertFloat32ToInt16 = function (buffer) {
        var l = buffer.length;
        var buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, buffer[l])*0x7FFF;
        }
        return buf.buffer;
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

    /**
    * A no-op function that can be a placeholder function; does nothing.
    */
    utils.noOp = function () {
        // do nothing
    };


    return utils;
});
