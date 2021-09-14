import * as Yup from 'yup';
import Waitlist from '../models/Waitlist';

class WaitingListController {
  //@ Open Created Waiting List for User
  //This is a private route
  async index(req, res) {
    const id = req.query.id;

    try {
      const waitlist = await Waitlist.find({ _id: id });
      console.log(waitlist);
      res.status(200).send({ success: true, waitlist });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
  //@ Create New Waiting List
  //This is a private route
  async store(req, res) {
    const schema = Yup.object().shape({
      companyName: Yup.string().required().min(2).max(24),
      websiteUrl: Yup.string().required().url(),
      domain: Yup.string().required().min(2).max(24),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { companyName, websiteUrl, domain } = req.body;

    const checkDomain = await Waitlist.findOne({ domain });
    if (checkDomain)
      return res
        .status(400)
        .send({ success: true, error: 'Domain already exists.' });
    const newList = new Waitlist({
      companyName,
      websiteUrl,
      domain,
      creatorId: req.user._id,
    });
    await newList.save();
    res.status(201).send({ success: true, newList });
  }

  //@ Edit Waiting List Fields
  //This is a private route
  async update(req, res) {
    const schema = Yup.object().shape({
      companyName: Yup.string().required().min(2).max(24),
      websiteUrl: Yup.string().required().url(),
      domain: Yup.string().required().min(2).max(24),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { companyName, websiteUrl, domain } = req.body;
    const id = req.query.id;

    const updateWaitlist = await Waitlist.findByIdAndUpdate(
      { _id: id, domain },
      { $set: { companyName, websiteUrl, domain } }
    );
    if (updateWaitlist)
      return res.status(201).send({ success: true, updateWaitlist });
  }
  //@ Delete Waiting List
  //This is a private route
  async delete(req, res) {
    const id = req.query.id;
    try {
      console.log(id);
      const waitlist = await Waitlist.findByIdAndRemove({
        _id: id,
      });

      res.status(200).send({ success: true, waitlist });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
}
export default new WaitingListController();
