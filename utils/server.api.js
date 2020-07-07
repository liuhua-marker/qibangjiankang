

//  const url = "https://health.qbjiankang.com";
//  const url = "http://192.168.2.114:8088";//本地端口地址
// const url = "http://192.168.2.104:8088";//本地端口地址
// const url = "http://192.168.2.168:8088";//本地端口地址
// const picPath='https://ykml.oss-cn-shenzhen.aliyuncs.com'  //  阿里云服务器，暂为虚拟
// const url = "https://health.qbjiankang.com";
// const url = "http://192.168.2.108:8088";//本地端口地址
 const url = "https://health.qbjiankang.com/testapi"; //测试地址q
// const url = "http://192.168.2.127:8088";//本地端口地址

const picPath='https://ykml.oss-cn-shenzhen.aliyuncs.com'  //  阿里云服务器，暂为虚拟
const picStyle = function () {
  return { "mini": "x-oss-process=style/mini", "row2": "x-oss-process=style/row2", "row3": "x-oss-process=style/row3"};
}
const type = {
  user:"UserManager/",
  data: "Information/",
  MZ:"OutPatient/",
  YJ:"Hospitalization/",
  MT:"MedicalTechnology/"
} 


//用户手机获取验证码
const updateImgUrlByOpenid = function () {
  return url + "/api-wechat/wxuser/updateImgUrlByOpenid";
}

//用户手机获取验证码
const getVerificationCode = function () {
  return url + "/api-wechat/wxuser/getVerificationCode";
}

//扫描二维码获取货物接口wxuser/getVerificationCode
const getGoodsData = function () {
  return url + "/api-wechat/wechatdevice/getGoodsData";
}


const getProbablySumSize = function () {//二级病症点击事件，将大概条数显示出来
  return url + "/api-wechat/case/findByStoreRecordListCount";
}

const getGoodsById = function () {//获取商品详情
  return url + "/api-basicgoods-core/goods/goods/getById";
}

const getSecondDesc = function () {//根据一级系统获取子项目，咽、喉、鼻....
  //return url + "/health-personal-service/personal/esproject/getSecondDesc";
  return url + "/api-wechat/wxuser/getSecondDesc";
}

const getFirstProject = function () {//获取一级项目，循环系统、呼吸系统....
  //return url + "/health-personal-service/personal/esproject/getFirstProject";
  return url + "/api-wechat/wxuser/getFirstProject";
}
const getMaterialDetail = function () {//获取素材详情
  //return url + "/health-personal-service/personal/esproject/getFirstProject";
  return url + "/health-personal-service/material/get/";
}

const insertPhone = function () {//用户同意授权手机号
  return url + "/api-wechat/wxuser/insertPhone";
}

const getDeciphering = function () {//用户登录获取手机号
  return url + "/api-wechat/wechatlogin/deciphering";
}

const getCaseById = function () { //获取服务销售话术数据
  return url + "/health-personal-service/system/qbcurecase/info/";
}

const getServiceSpeechData = function () { //获取服务销售话术数据
  return url + "/api-basicgoods-core/system/services/info/";
}
const getPolicyTagDetail = function () { //根据组合标准结果Id，获取健康建议、注意事项、销售推荐n
  return url + "/api-wechat/wxuser/getPolicyTagDetail/";
}
// const getNormDetail = function () { //根据标准结果Id，获取健康建议、注意事项、销售推荐n
//   return url + "/api-wechat/wxuser/getNormDetail/";
// }

const getNormDetail = function () { //根据标准结果Id，获取健康建议、注意事项、销售推荐n （ 新）
  return url + "/health-personal-service/per_peroration/findPerPerorationRecord/";
}
const getQbcurepreceptByID = function () { //获取单个服务专业知识等内容
  return url + "/health-personal-service/system/qbcureprecept/front/";
}
const getCurePrecept = function () {//查询该用户的本次体检治疗方案
  return url + "/api-wechat/case/getCurePrecept";
}

const getRoleAllOrg = function () {//根据userRole和openid获取所拥有的的所有组织
  return url + "/api-wechat/wechatrole/getRoleAllOrg";
}

const getOrganization = function () {//根据userRole获取组织
  return url + "/api-wechat/wechatrole/getOrganization";
}

const getFunctionByUserRole = function () {//根据userRole获取功能
  return url + "/api-wechat/wechatrole/getFunctionByUserRole";
}

const getRoleDistinctByOpenId = function () {//根据批次获取该批次的所有图片地址
  return url + "/api-wechat/wechatrole/getRoleDistinctByOpenId";
}

const getImageByBatch = function () {//根据批次获取该批次的所有图片地址
  return url + "/api-wechat/file/getImageByBatch";
}

const imageUpload = function () {//根据批次获取该批次的所有信息
  return url + "/api-wechat/file/fileUpload";
}

const getFlowListByBatic = function () {//根据批次获取该批次的所有信息
  return url + "/api-basicgoods-core/goods/deviceBatch/getFlowListByBatic";
}

const bindDevice = function () {//扫两张二维码，绑定机器。
  return url + "/api-basicgoods-core/goods/device/bindDevice";
}

const getGoodsboxAllData = function () {//扫两张二维码，绑定机器。
  return url + "/api-basicgoods-core/goods/goods/getGoodsboxAllData";
}
const getDeviceClassAllData = function () {//获取所有设备的二维码
  return url + "/api-basicgoods-core/goods/deviceclassify/getAllData";
}

const correctingData = function () {//获取所有设备的二维码
  return url + "/api-wechat/wechatdevice/correctingData";

}
//货物在自己状态下
const getshhouHistory = function () {
  return url + "/api-wechat/wechatdevice/getshhouHistory";
}

const insertWechatRole = function () {
  return url + "/api-wechat/wechat/wechatuser/insertWechatRole";
}


//获取发货历史记录
const getfhHistory = function () {
  return url + "/api-wechat/wechatdevice/getfhHistory";
}

//发货确认
const affirmGoods = function () {
  return url + "/api-wechat/wechatdevice/affirmGoods";
}

//根据token获取下级发货人员
const getSelfChild = function () {
  return url + "/api-system/system/business/getSelfChild";
}

//获取token
const getWechatToken = function () {
  return url + "/api-auth/jwt/weChatToken/";
}


//扫描二维码获取货物接口
const selectGoodsData = function () {
  return url + "/api-wechat/wechatdevice/selectGoodsData";
}

//根据openid查询该用户最近的角色记录
const getRoleHistoryByOpenId = function () {
  return url + "/api-wechat/rolehistory/getRoleHistoryByOpenId";
}


//向角色切换历史记录表插入数据
const insertRoleHistory = function () {
  return url + "/api-wechat/rolehistory/insertRoleHistory";
}


//获取用户角色信息
const getPageByUserRole = function () {
  return url + "/api-wechat/wechatrole/getPageByUserRole";
}

//扫描收货设备，确认收货
const scanExamine = function () {
  return url + "/api-wechat/wechatdevice/scanExamine";
}

//获取合法的销售信息
const getPassAffiliation = function () {
  return url + "/api-wechat/wechatbox/getPassAffiliation";
}

//插入服务记录
const insertServices = function () {
  return url + "/api-wechat/wechatbox/insertServices";
}

//获取服务历史
const getServicesHistory = function () {
  return url + "/api-wechat/wechatbox/getServicesHistory";
}

//获取绑定套盒信息
const getAffiliationServices = function () {
  return url + "/api-wechat/wechatbox/getAffiliationServices";
}

//扫描销售套盒
const affiliationScan = function () {
  return url + "/api-wechat/wechatbox/affiliationScan";
}

//用户登录获取openid
const getOnLogin = function () {
  return url + "/api-wechat/wechatlogin/onLogin";
}

//扫描设备
const getDeviceIdScan = function () {
  return url + "/api-wechat/wechatbox/deviceScan";
}

//店员注册
const addshop = function () {
  return url + "/api-wechat/wxuser/addshop";
}

//运营店员微信扫描客户之后完成注册
const addWcUserData = function () { 
  return url + "/api-wechat/wxuser/addUser";
}

//进入小程序后根据openid进行取值
const getUserDataByOpenId = function () {
  return url + "/api-wechat/wxuser/getUserDataByOpenId";
}

//根据健康码去的用户的治疗历史记录
const getUserDoweUrl = function () {
  return url + "/api-wechat/case/findByStoreRecordList";
}

//扫描套盒
const getBoxScan = function () {
  return url + "/api-wechat/wechatbox/boxScan";
}

/**
 * 发送Sms
 * 	传入参数
 * 		--		phone: 接收的手机号码
 * 		--		type: 短信类型 
 * 					0 - 验证码
 * 					1 - 确认短信
 */
const sendSms = function (phone, type) {
  return domain + api + '/sms/' + phone + '/type/' + type;
}

/*
* 获取购物车数据
*/ 
const CartIndex = function () {

  return url + "/creditup-mall/api/cart/data/v1.0.json";
}

//商品列表
const IndexUrlAdverGoods = function (userId) {
  return url + `/creditup-mall/api/shop/index/${userId}/v1.0.json`;
}
//获取分类
const queryAllType = function () {
  return url + `/creditup-mall/api/catalog/queryAll/v1.0.json`;
}
//获取商品
const queryProduct = function () {
  return url + `/creditup-mall/api/product/list/v1.0.json`;
}

//商品详情
const ProductsDetail = function (productId) {

  return url + `/creditup-mall/api/product/data/${productId}/v1.0.json`;
}
//商品详情
const toCartAdd = function () {

  return url + `/creditup-mall/api/cart/add/v1.0.json`;
}
//购物车检索
const CartChecked = function () {
  return url + `/creditup-mall/api/cart/checked/v1.0.json`;
}
//更新购物车
const CartUpdate = function () {

  return url + `/creditup-mall/api/cart/update/v1.0.json`;
}
//下单
const CartOrder = function () {

  return url + `/creditup-mall/api/cart/order/v1.0.json`;
}
//删除购物车
const payMoney = function (code) {
  return url + `/creditup-mall/api/cart/order/${code}/v1.0.json`;
}
//删除购物车
const CartDelete = function () {

  return url + `/creditup-mall/api/cart/delete/v1.0.json`;
}

//下单确认
const CartCheckout = function () {
  return url + `cart/checkout`;
}
//保存地址
const AddressSave = function () {
  return url + `/creditup-mall/api/address/save/v1.0.json`;
}
//保存地址
const RegionList = function () {
  return url + `/creditup-mall/api/area/childList/v1.0.json`;
}
// 获取手机号码
const wattel = function () {
  return url + `/creditup-mall/api/wallet/account/v1.0.json`;
}
// 验证码
const UserValidate = function () {
  return url + `/creditup-mall/api/validate/phoneCode/v1.0.json`;
}
// 获取微信支付参数
const PayPrepayId = function (code,id,type) {
  console.error(code,id,type)
  return url + `/creditup-mall/api/orderPay/addPay/${code}/${id}/${type}/v1.0.json`;
}
// 订单详情
const OrderDetail = function (id) {
  return url + `/creditup-mall/api/order/get/${id}/v1.0.json`;
}
// 订单取消
const OrderCancel = function () {
  return url + `/creditup-mall/api/order/cancelOrder/v1.0.json`;
}
// 确认收货
const OrderConfirm = function () {
  return url + `/creditup-mall/api/order/confirmOrder/v1.0.json`;
}
// 确认收货
const auditBack = function (orderid) {
  return url + `/creditup-mall/api/order/auditBack/${orderid}/v1.0.json`;
}

// 地址列表
const AddressList = function () {
  return url + `/creditup-mall/api/address/userList/v1.0.json`;
}
// 地址详情
const AddressDetail = function () {
  return url + `/creditup-mall/api/address/front/v1.0.json`;
}

// 删除地址
const AddressDelete = function (id) {
  return url + `/creditup-mall/api/address/delete/${id}/v1.0.json`;
}

// 提交订单
const OrderSubmit = function () {
  return url + `/creditup-mall/api/order/submit/v1.0.json`;
}
// 订单列表查询
const OrderList = function () {
  return url + `/creditup-mall/api/order/fontList/v1.0.json`;
}
//商户优惠卷
const TakeMerCoupon = function () {
  return url + `/coupon/getMerCoupon.do`;
}
//新增分享历史
const InsShareGoods = function () {
  return url + `/user/insShareGoods`;
}
//团购列表
const GroupBuyList = function () {
  return url + `/buy/getGroupBuyList.do`;
}
//获取购物车商品件数
const CartGoodsCount = function () {
  return url + `/cart/count/v1.0.json`;
}
//添加或取消收藏
const CollectAddOrDelete = function () {
  return url + `/creditup-mall/api/productCollect/toggle/v1.0.json`;
}
//添加或取消收藏
const BuyNowAdd = function () {
  return url + `/creditup-mall/api/cart/buy/v1.0.json`;
}
const rechargeauditSave = function () { //商户充值提交充值申请
  return url + `/health-personal-service/personal/rechargeaudit/save`;
}
const rechargeaudit = function () { //商户充值提交充值申请
  return url + `/health-personal-service/personal/rechargeaudit`;
}
const walletaccountInfo = function () { //商户充值信息
  return url + `/health-personal-service/personal/walletaccount/info`;
}
const picturemessageSave = function () { //订单截图图片上传地址
  return url + `/health-personal-service/personal/picturemessage/save`;
}
const picturemessage = function () { //获取银行名称
  return url + `/health-personal-service/personal/picturemessage`;
}
const queryOfficialAcount = function () { //官方充值账号
  return url + `/health-personal-service/personal/accountmessage/queryOfficialAcount`;
}
const qbEvalList = function () { //健康程度测评
  return url + `/health-management/qbEval/list`;

}
const getqbEvalReportByCreateBy = function () { //测评报告
  return url + `/health-management/qbEvalReport/getqbEvalReport`;
}

//积分
const walletStream = function () {
  return url + `/creditup-mall/api/wallet/streamList/v1.0.json`;
}
const qbEvalBuild = function () { //健康程度测评
  return url + `/health-management/qbEvalBuild`;
}
const commitQbEvalNaireVo = function () { //提交健康测评
  return url + `/health-management/qbEvalCommit/commitQbEvalNaireVo`;
}

const getQbEvalNaireVoByDiseaseId = function () { //病症测评结果
  return url + `/health-management/qbEvalBuild/getQbEvalNaireVoByDiseaseId`;
}

// 数据字典
const getDictByTypeCode = function (type) {
  return url + `/api-system/system/dict/getDictByTypeCode/${type}`;
}
// 话术包查询
const getSpeechcraftpackage = function (type) { 
  return url + `/health-personal-service/personal/speechcraftpackage`;
}
//获取所有店员
const getSpeechcraftUser = function () {
  return url + "/health-personal-service/personal/speechcraftuser/getSpeechcraftUser";
}
//获取店长下面的所有话术包
const querySpeechcraftByOrganId = function () {
  return url + "/health-personal-service/personal/speechcraftpackage/info/querySpeechcraftByOrganId";
}
// 分配话术保存
const saveSpeechcraftuser = function () {
  return url + "/health-personal-service/personal/speechcraftuser/save";
}
// 获取可执行话术
const getSpeechcraftByUserId = function (openId) {
  return url + "/health-personal-service/personal/speechcraftuser/getSpeechcraftByUserId/"+openId;
}
// 通过话术包Id 获取话术包详情
const getspeechcraftpackageInfo = function (packageId) {
  return url + "/health-personal-service/personal/speechcraftpackage/info/"+packageId;
}
// 通过话术Id 获取话术详情
const getSpeechcraftId = function (id) {
  return url + "/health-personal-service/personal/speechcraft/info/"+id;
}
// 话术训练保存
const saveSpeechcraftusertrainlog = function (id) {
  return url + "/health-personal-service/personal/speechcraftusertrainlog/save";
}
// 根据用户openId和计划id查询
const querySpeech = function (id) {
  return url + "/health-personal-service/personal/speechcraftusertrainlog/querySpeech";
}
// 根据获取月份
const getMonthByMonth = function (id) {
  return url + "/health-management/Appointment/getMonthByMonth";
}
// 查询已安排话术
const queryPackage = function (id) {
  return url + "/health-personal-service/personal/speechcraftusertrainlog/queryPackage";
}
// 获取预约内的信息
const getAppointmentMsgVo = function (id) {
  return url + "/health-management/AppointmentCommit/getAppointmentMsgVo";
}
// 提交预约
const appointmentCommit = function () {
  return url + "/health-management/AppointmentCommit/appointmentCommit";
}
// 获取当天预约信息
const getDayData = function () {
  return url + "/health-management/Appointment/getDay";
}
const getSpeechcraftinit = function () {
  return url + "/health-personal-service/personal/speechcraftinit";
}
// 已安排
const queryIng = function () {
  return url + "/health-personal-service/personal/speechcraftinit/queryIng";
}
// 已安排 || 已结束
const getPlanAndPackage = function () {
  return url + "/health-personal-service/personal/speechcraftuser/getPlanAndPackage";
}
// 已安排 || 已结束
const queryend = function () {
  return url + "/health-personal-service/personal/speechcraftinit/queryend";
}
// 调取是否管控接口
const updateControlStatus = function () {
  return url + "/api-wechat/wxuser/updateControlStatus";
}
// 获取权限
const passJurisdiction = function () {
  return url + "/api-wechat/system/expertslist/passJurisdiction";
}
module.exports = {
  url:url,
  getQbEvalNaireVoByDiseaseId: getQbEvalNaireVoByDiseaseId,
  getqbEvalReportByCreateBy:getqbEvalReportByCreateBy,
  rechargeaudit:rechargeaudit,
  addWcUserData: addWcUserData,
  getUserDataByOpenId: getUserDataByOpenId,
  getUserDoweUrl: getUserDoweUrl,
  getBoxScan: getBoxScan,
  getDeviceIdScan: getDeviceIdScan,
  getOnLogin: getOnLogin,
  affiliationScan: affiliationScan,
  getAffiliationServices: getAffiliationServices,
  getServicesHistory: getServicesHistory,
  insertServices: insertServices,
  getPassAffiliation: getPassAffiliation,
  scanExamine: scanExamine,
  getPageByUserRole: getPageByUserRole,
  insertRoleHistory: insertRoleHistory,
  getRoleHistoryByOpenId: getRoleHistoryByOpenId,
  selectGoodsData: selectGoodsData,
  getWechatToken: getWechatToken,
  getSelfChild: getSelfChild,
  affirmGoods: affirmGoods,
  getfhHistory: getfhHistory,
  insertWechatRole: insertWechatRole,
  getshhouHistory: getshhouHistory,
  bindDevice: bindDevice,
  addshop: addshop,
  getFlowListByBatic:getFlowListByBatic,
  imageUpload:imageUpload,
  getImageByBatch:getImageByBatch,
  getRoleDistinctByOpenId:getRoleDistinctByOpenId,
  getFunctionByUserRole:getFunctionByUserRole,
  getRoleAllOrg:getRoleAllOrg,
  getOrganization:getOrganization,
  getCurePrecept:getCurePrecept,
  getNormDetail:getNormDetail,
  getServiceSpeechData:getServiceSpeechData,
  getCaseById:getCaseById,
  getDeciphering:getDeciphering,
  insertPhone:insertPhone,
  getSecondDesc:getSecondDesc,
  getFirstProject:getFirstProject,
  getPolicyTagDetail:getPolicyTagDetail,
  getGoodsById:getGoodsById ,
  getProbablySumSize:getProbablySumSize,
  getGoodsData:getGoodsData,
  getGoodsboxAllData:getGoodsboxAllData,
  getDeviceClassAllData:getDeviceClassAllData,
  CartIndex:CartIndex,
  IndexUrlAdverGoods:IndexUrlAdverGoods,
  ProductsDetail:ProductsDetail,
  toCartAdd:toCartAdd,
  picPath:picPath,
  picStyle:picStyle,
  CartChecked:CartChecked,
  CartUpdate:CartUpdate,
  CartOrder:CartOrder,
  CartDelete:CartDelete,
  CartCheckout:CartCheckout,
  AddressSave:AddressSave,
  RegionList:RegionList,
  wattel:wattel,
  UserValidate:UserValidate,
  PayPrepayId:PayPrepayId,
  OrderDetail:OrderDetail,
  OrderCancel:OrderCancel,
  OrderConfirm:OrderConfirm,
  AddressList:AddressList,
  OrderSubmit:OrderSubmit,
  AddressDelete:AddressDelete,
  AddressDetail:AddressDetail,
  OrderList:OrderList,
  correctingData:correctingData,
  getVerificationCode:getVerificationCode,
  rechargeauditSave:rechargeauditSave,
  qbEvalList:qbEvalList,
  TakeMerCoupon:TakeMerCoupon,
  InsShareGoods:InsShareGoods,
  GroupBuyList:GroupBuyList,
  CartGoodsCount:CartGoodsCount,
  CollectAddOrDelete:CollectAddOrDelete,
  BuyNowAdd:BuyNowAdd,
  payMoney:payMoney,
  updateImgUrlByOpenid:updateImgUrlByOpenid,
  picturemessage:picturemessage,
  queryOfficialAcount:queryOfficialAcount,
  walletaccountInfo: walletaccountInfo,
  walletStream:walletStream,
  qbEvalBuild: qbEvalBuild,
  commitQbEvalNaireVo: commitQbEvalNaireVo,
  picturemessageSave: picturemessageSave,
  getDictByTypeCode:getDictByTypeCode,
  getSpeechcraftpackage:getSpeechcraftpackage,
  getSpeechcraftUser:getSpeechcraftUser,
  querySpeechcraftByOrganId:querySpeechcraftByOrganId,
  saveSpeechcraftuser:saveSpeechcraftuser,
  getSpeechcraftByUserId:getSpeechcraftByUserId,
  getspeechcraftpackageInfo:getspeechcraftpackageInfo,
  getSpeechcraftId:getSpeechcraftId,
  saveSpeechcraftusertrainlog:saveSpeechcraftusertrainlog,
  querySpeech:querySpeech,
  getMonthByMonth:getMonthByMonth,
  queryPackage:queryPackage,
  getAppointmentMsgVo:getAppointmentMsgVo,
  appointmentCommit:appointmentCommit,
  getDayData:getDayData,
  getSpeechcraftinit:getSpeechcraftinit,
  queryIng:queryIng,
  getPlanAndPackage:getPlanAndPackage,
  queryend:queryend,
  updateControlStatus:updateControlStatus,
  passJurisdiction:passJurisdiction,
  queryAllType:queryAllType,
  queryProduct:queryProduct,
  getQbcurepreceptByID:getQbcurepreceptByID,
  getMaterialDetail:getMaterialDetail,
  auditBack:auditBack 
}