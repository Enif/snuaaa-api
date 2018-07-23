import express from 'express';
import Account from '../models/account';

const router = express.Router();

/*
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: BAD USERNAME
        2: BAD PASSWORD
        3: USERNAM EXISTS
*/

router.get('/', (req, res) => {
    console.log("hello signup get");
    return res.json({ success: true });
})

router.post('/', (req, res) => {
    // CHECK USERNAME FORMAT
    let usernameRegex = /^[a-z0-9]+$/;

    console.log("hello signup post");

    if(!usernameRegex.test(req.body.id)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    // CHECK PASS LENGTH
    if(req.body.pw.length < 4 || typeof req.body.pw !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    // CHECK USER EXISTANCE
    Account.findOne({ username: req.body.id }, (err, exists) => {
        if (err) throw err;
        if(exists){
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 3
            });
        }

        // CREATE ACCOUNT
        let account = new Account({
            username: req.body.id,
            password: req.body.pw
        });

        // account.password = account.generateHash(account.password);

        // SAVE IN THE DATABASE
        account.save( err => {
            if(err) throw err;
            return res.json({ success: true });
        });

    });
});

export default router;

/* 
app.get('/api/books', function(req,res){
    Book.find(function(err, books){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(books);
    })
}); */