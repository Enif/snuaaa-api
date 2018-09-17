import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Photo = new Schema({
    author_id: String,
    author_name: String,
    album_no: String,
    title: String,
    path: String,
    created: { type: Date, default: Date.now }
});

export default mongoose.model('photo', Photo);