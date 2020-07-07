const urlApi = require('./server.api.js')
const request = function (method) {
    return (obj) => {
        var data = {}
        if (!obj || !obj.url) {
            obj.url = '/api-basicgoods-core/tableDict/pluseData';
            // data.organId=wx.getStorageSync('organId')
        }
        if (obj.showLoading) {
            wx.showLoading({
                mask: true,
                title: "加载中..."
            })
        }

        if (obj.data) data = {
            ...data,
            ...obj.data
        }
        console.log('token', wx.getStorageSync("token"))
        var header = {
            'content-type': 'application/json',
            Authorization: wx.getStorageSync("token"),
            openid: wx.getStorageSync("openid"),
            current_id: wx.getStorageSync("organId")
        }
        header = {
            ...header,
            ...obj.header || {},
        }
        // console.log(`request obj`)
        // console.log(obj)
        if (obj.url.indexOf('http') === -1) {
            obj.url = urlApi.url + obj.url
        }
        // try {
        //     var value = wx.getStorageSync('cookie')
        //     if (value) {
        //         header['cookie'] = value
        //     }
        //   } catch (e) {
        //     // Do something when catch error
        //   }
        // console.log(obj.url)
        wx.request({
            url: encodeURI(obj.url),
            method: method,
            data: data,
            header: header,
            success: (res) => {
                // console.log(res)
                if (obj.showLoading) {
                    wx.hideLoading()
                }
                if (!res.data || res.statusCode >= 300 || res.statusCode < 200) {
                    wx.showToast({
                        title: '接口请求失败, 请稍后重试!',
                        icon: 'none',
                        duration: 2000,
                    })
                    if (obj.fail) {
                        obj.fail()
                    }
                    return
                }
                if (res.data.errorCode < 0) {
                    wx.showToast(res.data.errorMsg)
                    if (obj.fail) {
                        obj.fail()
                    }
                    return
                }
                if (obj.success) {
                    obj.success(res)
                }
            },
            fail: () => {
                if (obj.showLoading) {
                    wx.hideLoading()
                }
                wx.showToast({
                    title: '接口请求失败, 请稍后重试!',
                    icon: 'none',
                    duration: 2000,
                })
                if (obj.fail) {
                    obj.fail()
                }
            },
            complete: () => {
                // if (obj.showLoading) {
                //     wx.hideLoading()
                // }
            }
        })
    }
}

module.exports = {
    get: request('GET'),
    post: request('POST'),
    delete: request('DELETE'),
    put: request('PUT')
}