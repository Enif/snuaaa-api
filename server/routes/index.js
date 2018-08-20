import express from 'express';

import signup from './signup';
import login from './login';
import userinfo from './userinfo';
import check from './check'

const router = express.Router();

router.use('/signup', signup);
router.use('/login', login);
router.use('/userinfo', userinfo);
router.use('/check', check);

export default router;