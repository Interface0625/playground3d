

function create(parent) {
  var F = function() {};
  F.prototype = parent;
  return new F();
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
