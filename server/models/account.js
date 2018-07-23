import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Account = new Schema({
    username: String,
    password: String,
    created: { type: Date, default: Date.now }
});

export default mongoose.model('account', Account);