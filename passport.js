const passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let users = Models.users,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            userField: 'Username',
            passwordField: 'Password',
        },
        (user, password, callback) => {
            console.log(user + ' ' + password);
            users.findONe({ User: user }, (error, user) => {
                if (error) {
                    console.log(error);
                    return callback(error);
                }

                if (!user) {
                    console.log('incorrect username');
                    return callback(null, false, {
                        message: 'Incorrect username or password'
                    });
                }

                console.log('finished');
                return callback(null, user);
            });
        }
    )
);

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error);
        });
}));
