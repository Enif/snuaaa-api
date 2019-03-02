import express from 'express';

import signup from './signup';
import login from './login';
import userinfo from './userinfo';
import check from './check';
import board from './board';
import post from './post';
import photoboard from './photoboard';
import album from './album';
import photo from './photo';
import document from './document';
import soundbox from './soundbox';
// import profile from './profile';

const router = express.Router();

router.use('/signup', signup);
router.use('/login', login);
router.use('/userinfo', userinfo);
router.use('/check', check);
router.use('/board', board);
router.use('/photoboard', photoboard);
router.use('/post', post);
router.use('/album', album);
router.use('/photo', photo);
router.use('/document', document);
router.use('/soundbox', soundbox);
// router.use('/profile', profile);

export default router;