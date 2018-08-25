import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Post = new Schema({
    user_id: String,
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