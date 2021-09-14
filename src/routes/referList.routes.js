import { Router } from 'express';

//@Importing Refer List  Controller
import ReferListController from '../app/controllers/referListController';
const referlist = new Router();

//User public route//
//No token required
/**----------------------------------------------------------------------------------------------------------------------*/
/**----------------------------------------------------------------------------------------------------------------------*/
referlist.post('/referlist', ReferListController.index); // referlist
/**----------------------------------------------------------------------------------------------------------------------*/

/**----------------------------------------------------------------------------------------------------------------------*/
export default referlist;
