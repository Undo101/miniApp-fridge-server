const express = require('express')
const router = express.Router()
const passport = require('passport')
const path = require('path')
const fse = require('fs-extra')
const utils = require('../../utils/utils')
// Multer node.js 的中间件，用于处理multipart/form-data类型的表单数据，它主要用于上传文件。
const multer = require('multer') 
const moment = require('moment')

const ctrlBook = require('../controllers/book')
const ctrlUsers = require('../controllers/users')


/**
 * 用户 routing
 */
// 微信小程序用户登录/注册
router.post('/users/wei_xin/auth', ctrlUsers.authWithWeiXinApp)
// 修改用户名
router.put('/users/me/name', 
    passport.authenticate('jwt', {session: false}),
    ctrlUsers.userUpdateName
)

/**
 * book routing
 */
// 获取book页面slider的图片
router.get('/book/sliderImage',
    passport.authenticate('jwt', {session: false}),
    ctrlBook.bookSlideImage
)
// 获取书目
router.get('/book/booklist', 
    passport.authenticate('jwt', {session: false}),
    ctrlBook.booklineList
)
// 创建一条书摘要
 router.post('/book',
    passport.authenticate('jwt', {session: false}),
    ctrlBook.booklineCreate
)

module.exports = router