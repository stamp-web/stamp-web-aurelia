export var ObjectUtilities = {
    isEqual: function (objA, objB) {
        if( !objA || !objB ) {
            return (!objA && !objB);
        }
        var aKeys = Object.keys(objA);
        var bKeys = Object.keys(objB);
        if (aKeys.length !== bKeys.length) {
            return false;
        }
        for (var i = 0, len = aKeys.length; i < len; i++) {
            var key = aKeys[i];
            if (!objB.hasOwnProperty(key) || objA[key] !== objB[key]) {
                return false;
            }
        }
        return true;
    }
};

export var StringUtil = {
    pluralize: function (str, count) {
        var s = str;
        if (count > 1) {
            if (str.endsWith("y")) {
                s = str.substring(0, str.length - 2) + 'ies';
            } else {
                s += 's';
            }
        }
        return s;
    }
};
