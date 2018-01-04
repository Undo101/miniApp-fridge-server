const request = require('request')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const WxBizDataCrypt = require('../../utils/wxBizDataCrypt')
const mongoose = require('mongoose')

require('../models/user')
const User = mongoose.model('User')

/**
 * 用户通过微信小程序进行注册/登陆
 * 根据微信小程序登陆的信息，获取对应user的openId和unionId，并创建对应的用户信息
 * @param req
 * @param res
 */
module.exports.authWithWeiXinApp = function (req, res) {
    const appId = config.wxAppID
    const appSecret = config.wxAppSecret
    const encryptrdData = req.body.encryptrdData
    const code = req.body.code
    const iv = req.body.iv
    let sessionKey = ''
    let requestOptions, path
    path = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
    requestOptions = {
        url: path,
        method: 'GET',
        json: {}
    }
    request( requestOptions, function (err, response, body) {
        if (err) {
            return res.tools.setJson(400, 1, err)
        }
        if (body.errcode === undefined) {
            sessionKey = body.session_Key
            const pc = new WxBizDataCrypt(appId, sessionKey)
            const data = pc.decryptData(encryptrdData, iv)
            let query = {}
            if (data.unionId) {
                query = {
                    'weiXin.unionId': data.unionId
                }
            } else if (data.openId) {
                query = {
                    'weiXin.appId': config.wxAppID,
                    'weixin.openId': data.openId
                }
            }
            User.findOne(query, function (err, user) {
                if(err) {
                    return res.tools.setJson(400, 1, err)
                }
                if (!user) {
                    let newUser = new User({
                        avatarUrl: data.avatarUrl,
                        name: data.nickName,
                        weiXin: {
                            appId: config.wxAppID,
                            openId: data.openId,
                            unionId: data.unionId,
                            nickName: data.nickName,
                            city: data.city,
                            avatarUrl: data.avatarUrl
                        }
                    })
                    newUser.save(function (err, savedUser) {
                        if (err) {
                            return req.tools.setJson(400, 1, err)
                        }
                        var token = jwt.sign(savedUser, config.secret, {
                            expiresIn: 60 * 60 * 48 // expires in 48 hours
                        })
                        return res.tools.setJson(201, 0, 'success', {
                            token: 'JWT' + token,
                            user: savedUser
                        })
                    })
                } else {
                    const token = jwt.sign(user, config.secret, {
                        expiresIn: 60 * 60 * 48 //expires in 48 hours
                    })
                    return res.tools.setJson(200, 0, 'success', {
                        token: 'JWT' + token,
                        user: user
                    })
                }
            })
        } else {
            return res.tools.setJson(400, 1, HTMLBodyElement.errmsg)
        }
    })
}
module.exports.userUpdateName = function (req, res) {
    if (req.user) {
        User.findById(req.user._id)
          .exec(function (err, user) {
              user.name = req.body.name
              user.save( function (err, user) {
                  if (err) {
                      return res.tools.setJson(400, 1, err)
                  } else {
                      return res.tools.setJson(200, 0, 'success', {
                          user: user
                      })
                  }
              })
          })
    } else {
        return res.tools.setJson(404, 1, 'no user')
    }
}