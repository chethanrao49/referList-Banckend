import { Router } from 'express';

//@Importing List Controller
import ListController from '../app/controllers/listsController';

//@Importing Auth Middleware
import authUser from '../app/middlewares/auth';

const lists = new Router();

//Lists private route//
// token required //
/**----------------------------------------------------------------------------------------------------------------------*/
/**----------------------------------------------------------------------------------------------------------------------*/
lists.get('/lists/:id', authUser, ListController.index); // User fetches the lists or (populate) the waiting list's created
/**----------------------------------------------------------------------------------------------------------------------*/

/**----------------------------------------------------------------------------------------------------------------------*/
export default lists;
