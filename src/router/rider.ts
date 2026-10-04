import express from 'express';
import { IsAuth } from '../middleware/isAuth.js';
import { addRiderProfile, fetchMyProfile, toggleRiderAvailablity } from '../controllers/rider.js';
import uploadFile from '../middleware/multer.js';

const router = express.Router();

router.post('/new' , IsAuth , uploadFile , addRiderProfile);
router.get('/myprofile' , IsAuth , fetchMyProfile);
router.patch('/toggle' , IsAuth , toggleRiderAvailablity);

export default router;