import { fromString } from 'uuidv4';
import Waitlist from '../models/Waitlist';
import User from '../models/User';
//import WaitingListMail from '../jobs/waitinglListMail';
//import Queue from '../../lib/queue';
import mailer from '../../lib/mailer';

class ReferListController {
  //@join by referral code
  async index(req, res) {
    let { refcode, domain, email } = req.query;
    try {
      let position = {},
        websiteUrl = ' ',
        notified = websiteUrl;
      // check if refcode exists
      let validCode = await User.findOne(
        { uniqueCode: refcode },
        { email: true },
        (err, result) => {
          if (err)
            return res.status(400).send({
              success: false,
              error: err.message,
            });
          else result;
        }
      );

      // check domain exists
      let domainExists = await Waitlist.findOne({ domain }, (err, result) => {
        if (err)
          return res.status(400).send({
            success: false,
            error: err.message,
          });
        else result;
      });
      // check if email exists in users collection
      let userExists = await User.findOne({ email }, (err, result) => {
        if (err)
          return res.status(400).send({
            success: false,
            error: err.message,
          });
        else result;
      });

      // check if email already in waiting list
      let emailExists = await Waitlist.findOne(
        { domain, 'users.email': email },
        (err, result) => {
          if (err)
            return res.status(400).send({
              success: false,
              error: err.message,
            });
          else result;
        }
      );
      if (!validCode)
        return res
          .status(404)
          .send({ success: false, error: 'invalid referral code' });

      if (!domainExists)
        return res
          .status(404)
          .send({ success: false, error: 'Domain does not exists.' });

      if (validCode) {
        let getPosition = await Waitlist.findOne(
          { domain, 'users.email': validCode.email },
          { 'users.$': true, websiteUrl: true },
          (err, result) => {
            if (err)
              return res.status(400).send({
                success: false,
                error: err.message,
              });
            else result;
          }
        );
        console.log(getPosition.users[0].position);

        if (getPosition) {
          position = getPosition.users[0].position;
          notified = getPosition.users[0].mailNotify === true ? true : false;
          websiteUrl = getPosition.websiteUrl;
        }
        console.log(notified);
      }
      let html = `<h3>You are now a top priority in our waiting list</h3> URL: ${websiteUrl}/${domain}`;

      let response = {};
      if (!userExists && !emailExists) {
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

        // let waitlist = await Waitlist.findOneAndUpdate({ domain });

        // update referral position
        position = position > 1 ? position - 1 : 1;
        if (position == 1 && !notified) {
          notified = true;
          // await Queue.add(WaitingListMail.key, validCode.email, {
          //   waitlist,
          // });
          // WaitingListMail;
          mailer.send(validCode.email, 'Congratulations', html);
        }

        let updatepos = await Waitlist.findOneAndUpdate(
          { domain, 'users.email': validCode.email },
          {
            $set: {
              'users.$.position': position,
              'users.$.mailNotify': notified,
            },
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
      } else if (userExists && !emailExists) {
        // update referral position
        position = position > 1 ? position - 1 : 1;
        if (position == 1 && !notified) {
          notified = true;
          // await Queue.add(WaitingListMail.key, validCode.email, {
          //   waitlist,
          // });
          // WaitingListMail;
          mailer.send(is_valid_code.email, 'Congratulations', html);
        }
        let updatepos = await Waitlist.findOneAndUpdate(
          { domain, 'users.email': validCode.email },
          {
            $set: {
              'users.$.position': position,
              'users.$.mailNotify': notified,
            },
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
      } else {
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
        );
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
        return res.status(200).send({
          success: true,
          message: 'already in waitlist',
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

export default new ReferListController();
