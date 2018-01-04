var fs = require('fs');
var express = require('express');
var router = express.Router();

router.get('/getOurbookConfig', (req, res, next) => {
    // 读取对应的配置文件， 并返回给客户端
    var config = fs.readFileSync('./files/ourBook.config', 'utf8');
    res.json({status: 200, data: JSON.parse(config)});
});
// 这里指定了路径为/getOurbookConfig,意味着可以通过http://localhost:3000/getOurbookConfig/获取对应的数据
module.exports = router;