const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport');

// eslint-disable-next-line prefer-const
let genterateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
};

module.exports = (router) => {
    router.post('/login', (req, res) => {
        // eslint-disable-next-line consistent-return
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'SOmething is wrong',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                // eslint-disable-next-line prefer-const
                let token = genterateJWTToken(user.toJson());
                return res.json({ user, token });
            });
        })(req, res);
    });
};
