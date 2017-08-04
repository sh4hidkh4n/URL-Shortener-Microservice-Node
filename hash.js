var alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
var base = alphabet.length;
// convert a url with an id into base64 encoded hash
function encodeHash(num){
  var encoded = '';
  while (num){
    var remainder = num % base;
    num = Math.floor(num / base);
    encoded = alphabet[remainder].toString() + encoded;
  }
  return encoded;
}

// decode base64 hash and return decoded value

function decodeHash(hash){
  var decoded = 0;
  while (hash){
    var index = alphabet.indexOf(hash[0]);
    var power = hash.length - 1;
    decoded += index * (Math.pow(base, power));
    hash = hash.substring(1);
  }
  return decoded;
}

module.exports.encodeHash = encodeHash
module.exports.decodeHash = decodeHash