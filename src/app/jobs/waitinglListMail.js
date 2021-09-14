//@Importing Mail Library
import Mail from '../../lib/Mail';

class WaitingListMail {
  get key() {
    return 'WaitingListMail';
  }

  async handle({ data }) {
    const { waitlist } = data;

    console.log('A file execution');

    await Mail.sendMail({
      to: `${waitlist.users.name} <${waitlist.users.name}>`,
      subject: 'Your waiting list invitation',
      template: 'Congratulations',
      context: {
        users: waitlist.users.name,
        html: `<h3>You are now a top priority in our waiting list</h3> URL: ${waitlist.websiteUrl}/${waitlist.domain}`,
      },
    });
  }
}

export default new WaitingListMail();
