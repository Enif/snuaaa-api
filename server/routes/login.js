/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/
router.post('/login', (req, res) => {

    if(typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    // FIND THE USER BY USERNAME
    Account.findOne({ username: req.body.username}, (err, account) => {
        if(err) throw err;

        // CHECK ACCOUNT EXISTANCY
        if(!account) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        // CHECK WHETHER THE PASSWORD IS VALID
        if(!account.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        // ALTER SESSION
        let session = req.session;
        session.loginInfo = {
            _id: account._id,
            username: account.username
        };

        // RETURN SUCCESS
        return res.json({
            success: true
        });
    });
});