import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Post = new Schema({
    post_no: Number,
    author_id: String,
    author_name: String,
    title: String,
    contents: String,
    created: { type: Date, default: Date.now }
});


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