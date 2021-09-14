import Waitlist from '../models/Waitlist';

class ListController {
  //@ Show Created Waiting Lists for User
  //This is a private route
  async index(req, res) {
    try {
      let waitlists = await Waitlist.find({ creatorId: req.user._id }).lean();
      console.log(waitlists);
      res.status(200).send({ success: true, waitlists });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
}

export default new ListController();
