import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const Account = new Schema({
    id: String,
    password: String,
    passwordCf: String,
    username: String,
    aaaNum: String,
    schoolNum: String,
    major: String,
    email: String,
    mobile: String,
    introduction: String,
    profilePath: String,
    created: { type: Date, default: Date.now }
});

Account.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 8);
};

Account.methods.validateHash = function(password) {
    return bcrypt.compareSync(password, this.password);
}

Account.statics.findOneByUserid = function (id) {
    return this.findOne({ id });
  };

export default mongoose.model('account', Account);

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