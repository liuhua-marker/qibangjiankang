const urlApi = require('server.api.js')

function getUser() {
}
function getCity() {
 //下面写我们的代码  
}
module.exports = { //必须在这里暴露接口，以便被外界访问，不然就不能访问
  getUser: getUser,
  getCity: getCity
}