var moment = require('moment')
var jwt = require('jwt-simple')

var userColl = mongoConfig.users.collName
var roles = ['ADMIN', 'USER']

module.exports = {

    loginUser: function() {
        return function(req, res) {
            var body = req.body || {}

            db.collection(userColl).findOne({
                email: (body.email || "").toLowerCase(), // Email is case-insensitve
                isDeleted: false
            }, function(err, user) {
                if (user) {
                    var valid = helper.verifySaltHash(user.pwd, body.pwd || "") // Verify the password with salted password
                    if (valid) {
                        delete user.pwd;
                        sendToken(res, user)
                    } else {
                        helperResp.unauth(res, "Invalid Email or Password")
                    }
                } else {
                    if (err) {
                        helperResp.serverError(res);
                    } else {
                        helperResp.unauth(res, "Invalid Email or Password")
                    }
                }
            })
        }
    },
    registerUser: function() {
        return function(req, res) {

            var body = req.body || {}

            var validations = [{
                name: 'name',
                type: 'string',
                errMsg: "Name Can only be a String"
            }, {
                name: "email",
                type: 'string',
                validate: [helperValidate.isEmail, uniqueUserEmail],
                validateErrMsg: ["Invalid Email", "Email ID Has already been registered"],
                transform: helperTransform.toLowerCase,
                errMsg: "Email Can only be a String"
            }, {
                name: 'pwd',
                type: 'string',
                errMsg: "Password can only be a String"
            }]

            helper.validateFieldsExistenceCb(body, validations, true, function(err) {
                if (err) {
                    helperResp.failed(res, err)
                } else {
                    body.isDeleted = false
                    body.role = "USER"
                    body.pwd = helper.saltHash(body.pwd);
                    db.collection(userColl).insert(body, function(err, user) {
                        if (user) {
                            sendToken(res, user)
                        } else {
                            helperResp.serverError(res)
                        }
                    })
                }
            })
        }
    },
    validateToken: function(req, res, next) {
        var token = (req.signedCookies && req.signedCookies['token']) || (req.headers['x-access-token'] || req.body && req.body.access_token) || (req.query && req.query.access_token) || null; // Get JWT Token
        if (token) {
            var decToken;
            try {
                decToken = jwt.decode(token, config.app.token.secret)
            } catch (err) {
                return res.redirect("/portal/login")
            }

            if (decToken && decToken.expires && decToken.iss) {
                if (moment(decToken.expires).diff(moment(), 'minute') > 0) {
                    db.collection(userColl).findOne({
                        _id: db.ObjectId(decToken.iss),
                        isDeleted: false
                    }, {
                        pwd: 0,
                        isDelete: 0,
                    }, function(err, user) {
                        req.user = user;
                        if (req.user && roles.indexOf(req.user.role) > -1) {
                            next()
                        } else {
                            res.redirect("/portal/login")
                        }
                    })
                } else {
                    res.redirect("/portal/login")
                }
            } else {
                res.redirect("/portal/login")
            }
        } else {
            res.redirect("/portal/login")
        }
    },
    logout: () => {
        return function(req, res) {
            res.clearCookie("token")
            helperResp.success(res, "Successfully Logged Out")
        }
    }
}

function sendToken(res, user) {
    var expires = moment().add(config.app.token.validity, 'day')._d
    var token = {
        iss: user._id,
        expires: expires
    }

    var encToken = jwt.encode(token, config.app.token.secret, 'HS256');
    res.cookie('token', encToken, { signed: true })

    res.status(200).send({
        error: false,
        data: {
            token: encToken,
            expires: expires,
            user: user
        }
    })
}

function uniqueUserEmail(email, cb) {
    db.collection(userColl).findOne({
        email: email.toLowerCase(),
        isDeleted: false
    }, { _id: 1 }, function(err, user) {
        cb(err, !user)
    })
}