import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

var Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  google: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  uniqueCode: String,
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, authConfig.secret);
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
  } catch (e) {
    throw new Error(e.message);
  }
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email: email });
  // console.log(email);
  console.log('model', user);

  if (!user) {
    throw new Error({
      message: 'unable to login',
      success: false,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  //console.log(password);
  console.log(isMatch);

  if (!isMatch) {
    throw new Error({
      message: 'Password is incorrect',
      success: false,
    });
  }

  return user;
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;

//export default mongoose.model('User', userSchema);
