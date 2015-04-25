export var ObjectUtilities = {
  isEqual: function(objA, objB) {
    var aKeys = Object.keys(objA);
    var bKeys = Object.keys(objB);
    if( aKeys.length != bKeys.length ) {
      return false;
    }
    for( var i = 0, len = aKeys.length; i < len; i++ ) {
      var key = aKeys[i];
      if( !objB.hasOwnProperty(key) || objA[key] !== objB[key] ) {
        return false;
      }
    }
    return true;
  }
};
