import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const waitlistSchema = new Schema({
  companyName: {
    type: String,
    default: '',
  },
  websiteUrl: {
    type: String,
    default: '',
  },
  domain: {
    type: String,
    default: '',
  },
  creatorId: {
    // type: Schema.ObjectId,
    // ref: 'User',
    // required: 'You must supply an user',
    type: String,
  },
  users: [
    {
      email: {
        type: String,
        default: '',
      },
      position: {
        type: Number,
        default: 3,
      },
      emailNotify: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

export default mongoose.model('Waitlist', waitlistSchema);
