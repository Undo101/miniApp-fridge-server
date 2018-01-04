const redis = require('redis')  // 数据结构服务器 key-value存系统
const config = require('../config/config')
 
const redisClient = redis.createClient(config.redis) // config.redis = redis:localhost:6666

redisClient
    .on('error', err => console.log('Redis connection error: ' + err))
    .on('connect', () => console.log('Redis connected to ' + config.redis))
    .on('end', () => console.log('Redis ended'))

module.exports = {
    redis: redis,
    redisClient: redisClient
}