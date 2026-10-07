import express from 'express';
import { IsAuth } from '../middleware/isAuth.js';
import { acceptOrder, addRiderProfile, fetchMyCurrentOrder, fetchMyProfile, toggleRiderAvailablity, updateOrderStatus } from '../controllers/rider.js';
import uploadFile from '../middleware/multer.js';

const router = express.Router();

router.post('/new' , IsAuth , uploadFile , addRiderProfile);
router.get('/myprofile' , IsAuth , fetchMyProfile);
router.patch('/toggle' , IsAuth , toggleRiderAvailablity);
router.post('/accept/:orderId' , IsAuth,acceptOrder);
router.get('/order/current' , IsAuth,fetchMyCurrentOrder);
router.put('/order/update/:orderId' , IsAuth,updateOrderStatus);


export default router;