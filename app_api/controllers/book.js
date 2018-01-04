const mongoose =require('mongoose')
const config = require('../config/config')
const validator = require('validator') // 验证或清理字符串
// Moment.js 是一个JavaScript 日期处理类库，用于解析、检验、操作、以及显示日期
const moment = require('moment') 
const request = require('request')

const fs =  require('fs')
const path = require('path')
const fse = require('fs-extra')

require('../models/booklist')

const bookline = mongoose.model('bookline')
// var bookline = require(path.resolve('./models/booklist.model'));
const ctrlSettings = require('./setting')
const utils = require('../../utils/utils')

function validatebookForm (payload) {
    const errors = {}
    let isFormValid = true
    if (!payload || validator.isEmpty(payload.title)) {
        isFormValid = false
        errors.title = '请填写[书名]'
    }
    if (!isFormValid) {
        errors.summary = '请检查表单字段中的错误'
    }
    return {
        success: isFormValid,
        errors
    }
}
module.exports.bookSlideImage = function (req, res) {
    let query = {"pic_id": req.pic.pic_id}
}
module.exports.booklineCreate = function (req, res) {
    const validateResult = validatebookForm(req.body)
    if (!validateResult.success) {
        return res.tools.setJson(400, 1, validateResult.errors)
    }
    
    if (req.body) {
        bookline.create({
            name: req.body.name,
            author: req.body.author,
            text: req.body.text,
            feeling: req.body.feeling,
            create_time: req.body.create_time
        }, function (err, doc) {
            if (err) {
                return res.tools.setJson(400, 1, err)
            } else {
                let bookline = {}
                bookline.book_id = doc.book_id
                bookline.name = doc.title
                bookline.text = doc.text
                bookline.feeling = doc.feeling
                let writeTime = moment(doc.writeTime).format('YYYY-MM-DD')
                bookline.create_time = writeTime
                return req.tools.setJson(201, 0, 'success', {
                    bookline: bookline
                })
            }
        })
    }
}
module.exports.booklineList = function (req, res) {
    let query = {"create_user": req.user.user_id}
    bookline.paginate(query, function (err, result) {
        if (err) {
            return res.tools.setJson(400, 1, err)
        }
        let booklist = []
        result.docs.forEach(function (doc) {
            let bookline = {}
            bookline.book_id = doc.book_id
            bookline.title = doc.title
            bookline.author = doc.author
            bookline.text = doc.text
            bookline.feeling = doc.feeling
            bookline.create_time = doc.create_time
            books.push(bookline)
        })
        return res.tools.setJson(200, 0, 'success', {
            booklist: booklist
        })
    })
}