import express from 'express';

import signup from './signup';
import login from './login';
import userinfo from './userinfo';
import check from './check';
import board from './board';
import photoboard from './photoboard';
import post from './post';

const router = express.Router();

router.use('/signup', signup);
router.use('/login', login);
router.use('/userinfo', userinfo);
router.use('/check', check);
router.use('/board', board);
router.use('/photoboard', photoboard);
router.use('/post', post);

export default router;