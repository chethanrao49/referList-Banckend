import * as Yup from 'yup';
import User from '../models/User';
import { fromString } from 'uuidv4';

class UserController {
  //@ Creat a new user
  //@ user/register
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6).max(18),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    try {
      const { name, email, password } = req.body;

      const userExists = await User.findOne({ email: email });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
      let uniqueCode = await fromString(email);

      const user = await new User({
        name,
        email,
        password,
        uniqueCode,
      }).save();
      res.status(201).send({ success: true, user });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  //@ find user, login in him with email and password
  //@ user/Login
  async index(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6).max(18),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, password } = req.body;

    try {
      const user = await User.findByCredentials(email, password);
      console.log('UC login', user);

      const token = await user.generateAuthToken();
      console.log('UC login token', token);

      res.send({ user, token });
    } catch (e) {
      res.status(400).send({
        error: { message: 'You have entered an invalid email or password' },
      });
    }
  }
}

export default new UserController();
