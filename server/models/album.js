import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Album = new Schema({
    author_id: String,
    author_name: String,
    board_no: String,
    title: String,
    created: { type: Date, default: Date.now }
});

export default mongoose.model('album', Album);