import jwt from 'jsonwebtoken';
import { promisify } from 'util';

//@Importing User Model
import User from '../models/User';

//@Importing Auth Config
import authConfig from '../../config/auth';

const authUser = async function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Customer Token not provided' });
  }

  const [, token] = authHeader.split(' '); // Discard "Bearer "

  // Define try and catch, as this can return an error
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    const user = await User.findOne({
      _id: decoded._id,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({ error: 'please authenticate user' });
  }
};
module.exports = authUser;
