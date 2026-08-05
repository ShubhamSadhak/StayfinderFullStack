import {PGregister,  getAllPGs, getSinglePG, updatePG, deletePG} from '../controllers/pg.controller.js';
import {Router} from 'express';
import {verifyjwt} from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/addpg')
.post(verifyjwt, PGregister);

router.route('/getpg')
.get(verifyjwt, getAllPGs);

router.route('/getpg/:pgId')
.get(getSinglePG);

router.route('/updatepg/:pgId')
.put(verifyjwt, updatePG);

router.route('/deletepg/:pgId')
.delete(verifyjwt, deletePG);

export default router;