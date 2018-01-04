const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate')
var db = require('./db');
require('./counter');
const Counter = mongoose.model('Counter')
console.log('a')

var bookSchema = new mongoose.Schema (
    {
        name: String,
        author: String,
        text: String,
        feeling: String,
        create_time: {type: Date, default: Date.now}
    }
)
bookSchema.plugin(mongoosePaginate)

bookSchema.pre('save', function (next) {
    let doc = this
    if (this.isNew) {
        Counter.findByIdAndUpdate({_id: 'book_id'}, {$inc: {seq: 1}}, {
            new: true,
            upsert: true
        }, function (error, counter) {
            if (error) {
                return next(error)
            }
            doc.book_id = counter.seq
            next()
        })
    } else {
        return next()
    }
})

module.exports = db.model('bookline', bookSchema);
// mongoose.model('bookline', bookSchema)