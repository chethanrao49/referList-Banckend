import { Router } from 'express';

//@Importing Controller
import WaitingListController from '../app/controllers/waitingListController';

//@Importing auth middleware
import authUser from '../app/middlewares/auth';
const waitingList = new Router();

//WaitingLists private route//
// token required
/**----------------------------------------------------------------------------------------------------------------------*/
/**----------------------------------------------------------------------------------------------------------------------*/
/**----------------------------------------------------------------------------------------------------------------------*/
waitingList.post('/waitList/:id', authUser, WaitingListController.index); //Fetch curtain or specific waitlist
/**----------------------------------------------------------------------------------------------------------------------*/
/**----------------------------------------------------------------------------------------------------------------------*/
waitingList.post('/:id/waitList/create', authUser, WaitingListController.store); //User create(s)  waitinglist
/**----------------------------------------------------------------------------------------------------------------------*/
/**----------------------------------------------------------------------------------------------------------------------*/
waitingList.patch(
  '/updatewaitlist/:id',
  authUser,
  WaitingListController.update
); //User updates the waitinglist(s)
/**----------------------------------------------------------------------------------------------------------------------*/
waitingList.post(
  '/waitinglistdelete/:id',
  authUser,
  WaitingListController.delete
); // User delete(s) the waitinglist
/**----------------------------------------------------------------------------------------------------------------------*/

/**----------------------------------------------------------------------------------------------------------------------*/
export default waitingList;
