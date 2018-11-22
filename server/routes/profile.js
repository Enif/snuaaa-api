import express from 'express';

const router = express.Router();

router.get('/:path', (req, res) => {
    console.log('[retriveProfile] ');
    console.log(req.params.path);
    // res.sendFile(path.resolve(__dirname + '../../upload/profile/') + req.params.path)
    res.sendFile(req.params.path, {root: './upload/profile/'})
})

export default router;


/* 
The following example illustrates how res.sendFile() may be used as an alternative for the static() middleware for dynamic situations. The code backing res.sendFile() is actually the same code, so HTTP cache support etc is identical.

 app.get('/user/:uid/photos/:file', function(req, res){
   var uid = req.params.uid
     , file = req.params.file;

   req.user.mayViewFilesFrom(uid, function(yes){
     if (yes) {
       res.sendFile('/uploads/' + uid + '/' + file);
     } else {
       res.send(403, 'Sorry! you cant see that.');
     }
   });
 });
@api — public
 */