import mongoose from 'mongoose';

const Post = new mongoose.Schema({
    post_no: Number,
    author_id: String,
    author_name: String,
    board_no: String,
    title: String,
    contents: String,
    created: { type: Date, default: Date.now }
});

// Post.statics.PostFindLatestNumber = function () {
//     return this.findOne({}, null, {sort: {"post_no":-1}})
// }

Post.method.create = function (payload) {
    const post = new this(payload);
    return post.save();
}


export default mongoose.model('post', Post);

/*** Schema TYPE ****
 * 
 * String
 * Number
 * Date
 * Buffer
 * Boolean
 * Mixed
 * Objectid
 * Array
 * 
 */