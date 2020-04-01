var Promise = require('/promise.js');
function wxPromisify(fn) {
  return function(obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function(res) {
        resolve(res)
      }
      obj.fail = function(res) {
        resolve(res)
      }
      fn(obj)
    })
  }
}
module.exports = {
  wxPromisify: wxPromisify
}