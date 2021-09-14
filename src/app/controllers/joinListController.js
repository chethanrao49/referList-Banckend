import { fromString } from 'uuidv4';
import Waitlist from '../models/Waitlist';
import User from '../models/User';

class JoinListController {
  //@join to a waiting list
  async index(req, res) {
    let { email } = req.body;
    let { domain } = req.query;
    try {
      // check if domain exists
      let domainExists = await Waitlist.findOne({ domain });
      if (!domainExists)
        return res
          .status(404)
          .send({ success: false, error: 'Domain does not exists.' });

      // check if email exists in users collection
      let userExists = await User.findOne({ email }, (err, result) => {
        if (err)
          return res.status(400).send({
            success: false,
            error: err.message,
          });
        else result;
      });
      let emailExists = await Waitlist.findOne(
        {
          domain,
          'users.email': email,
        },
        (err, result) => {
          if (err)
            return res.status(400).send({
              success: false,
              error: err.message,
            });
          else result;
        }
      );

      let response = {};

      if (!userExists && !emailExists) {
        // add new user to users collection
        let uniqueCode = await fromString(email);
        let adduser = new User({ email, uniqueCode });
        await adduser.save((err, result) => {
          if (err)
            return res.status(400).send({
              success: false,
              error: err.message,
            });
          else result;
        });
        console.log(adduser);

        // add email to list
        await Waitlist.findOneAndUpdate(
          { domain },
          { $addToSet: { users: { email } } },
          (err, result) => {
            if (err)
              return res.status(400).send({
                success: false,
                error: err.message,
              });
            else result;
          }
        );

        response = await Waitlist.findOne(
          { domain, 'users.email': email },
          { 'users.$': true },
          (err, result) => {
            if (err)
              return res.status(400).send({
                success: false,
                error: err.message,
              });
            else result;
          }
        ).lean();
        response.uniqueCode = uniqueCode;
      } else if (userExists && !emailExists) {
        // user exists but not in waiting list
        await Waitlist.findOneAndUpdate(
          { domain },
          { $addToSet: { users: { email } } },
          (err, result) => {
            if (err)
              return res.status(400).send({
                success: false,
                error: err.message,
              });
            else result;
          }
        );

        response = await Waitlist.findOne(
          { domain, 'users.email': email },
          { 'users.$': true },
          (err, result) => {
            if (err)
              return res.status(400).send({
                success: false,
                error: err.message,
              });
            else result;
          }
        ).lean();

        let getUniqueCode = await User.findOne(
          { email },
          { uniqueCode: true },
          (err, result) => {
            if (err)
              return res.status(400).send({
                success: false,
                error: err.message,
              });
            else result;
          }
        );
        response.uniqueCode = getUniqueCode.uniqueCode;
      } else if (userExists && emailExists) {
        response = await Waitlist.findOne(
          { domain, 'users.email': email },
          { 'users.$': true },
          (err, result) => {
            if (err)
              return res.status(400).send({
                success: false,
                error: err.message,
              });
            else result;
          }
        ).lean();
        let getUniqueCode = await User.findOne(
          { email },
          { uniqueCode: true },
          (err, result) => {
            if (err)
              return res.status(400).send({
                success: false,
                error: err.message,
              });
            else result;
          }
        );
        response.uniqueCode = getUniqueCode.uniqueCode;
        return res.status(201).send({
          success: true,
          message: 'already added in waitlist',
          response,
        });
      }
      return res.status(201).send({
        success: true,
        message: 'added to waitlist',
        response,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
}
export default new JoinListController();
