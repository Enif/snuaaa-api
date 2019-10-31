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
import home from './home';
import content from './content';
import comment from './comment';
import image from './image';
import exhibition from './exhibition';
import exhibitPhoto from './exhibitPhoto';

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
router.use('/home', home);
router.use('/content', content);
router.use('/comment', comment);
router.use('/image', image);
router.use('/exhibition', exhibition);
router.use('/exhibitPhoto', exhibitPhoto);

export default router;