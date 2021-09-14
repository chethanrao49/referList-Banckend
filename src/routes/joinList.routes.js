import { Router } from 'express';

//@Importing Refer List  Controller
import JoinListController from '../app/controllers/joinListController';
const joinlist = new Router();

//User public route//
//No token required
/**----------------------------------------------------------------------------------------------------------------------*/
/**----------------------------------------------------------------------------------------------------------------------*/
joinlist.post('/joinlist/:domain', JoinListController.index); // joinlist
/**----------------------------------------------------------------------------------------------------------------------*/

/**----------------------------------------------------------------------------------------------------------------------*/
export default joinlist;
