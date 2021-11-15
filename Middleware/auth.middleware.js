require('dotenv').config()
const jwt = require("jsonwebtoken");
const AppResponseDto = require("../dtos/responses/app_response.dto");

// const checkToken = expressjwt({
//   secret: process.env.SECRET_KEY || "JWT_SUPER_SECRET",
//   userProperty: "decodedJwt",
// });

const User = require("../config/Connectdb").User;
const Role = require("../config/Connectdb").Role;

const readToken = function (req, res, next) {
  if (req.user !== null) return next();

//   if (
//     (req.hasOwnProperty("headers") &&
//       req.headers.hasOwnProperty("authorization") &&
//       req.headers.authorization.split(" ")[0] === "Bearer") ||
//     (req.headers.authorization &&
//       req.headers.authorization.split(" ")[0] === "Token")
//   ) {
//     checkToken(req, res, next);
//   } else {
//     return next();
//   }

if (!req.headers['authorization']) {
    return res.status(400).json({ success: false, message: 'No access token provided' });
  }
  const accessToken = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }


};

exports.isAdmin = (req, res, next) => {

    if (req.user === null)
        return res.json(AppResponseDto.buildWithErrorMessages('Access denied, you re not Logged In'));

    if (req.user.roles.some(role => role.name === 'ROLE_ADMIN'))
        next();
    else
        return res.json(AppResponseDto.buildWithErrorMessages('Access denied, you re not an Author'));
};


const getFreshUser = (required) => {
    return (req, res, next) => {
        if (req.decodedJwt == null || req.decodedJwt.userId == null) {
            if (required) // no jwt, and it is required
                return res.json(AppResponseDto.buildWithErrorMessages('Permission denied'));
            else // no jwt, but it is not required
                return next();
        }
        User.findOne({
            where: {id: req.decodedJwt.userId}, include: [Role]
        })
            .then((user) => {
                if (!user) {
                    // if no user is found, but
                    // it was a valid JWT but didn't decode
                    // to a real user in our DB. Either the user was deleted
                    // since the client got the JWT, or
                    // it was a JWT from some other source
                    res.status(401).send({error: 'Unauthorized'});
                } else {
                    // update req.user with fresh user from
                    // stale token data
                    req.user = user;
                    // console.log('getFreshUser then \n', req.user);
                    next();
                }
            })
            .catch((err) => {
                // console.log('getFreshUser catch \n', err);
                next(err);
            });
    };
};

exports.isAuthenticated = (req, res, next) => {
    if (req.user != null) {
        next();
        return;
    }
    return res.json(AppResponseDto.buildWithErrorMessages('Permission denied, you must be authenticated'))
};

exports.signToken = (id) => {
    return jwt.sign(
        {id},
        process.env.SECRET_KEY || 'JWT_SUPER_SECRET',
        {expiresIn: process.env.JWT_EXPIRE_TIME || 30000}
    );
};

exports.mustBeAuthenticated = [readToken, getFreshUser(true)];
exports.loadUser = [readToken, getFreshUser(false)];



exports.userOwnsItOrIsAdmin = (req, res, next) => {
    if (req.user != null && (req.user.isAdminSync() || req.userOwnable.userId === req.user.id))
        next();
    else
        return res.json(AppResponseDto.buildWithErrorMessages('This resource does not belong to you'));
};


// TODO: replace by userOwnsItOrIsOnly
exports.ownsCommentOrIsAdmin = (req, res, next) => {
    if (req.user != null && (req.user.roles.some(role => role.name === 'ROLE_ADMIN') // is admin ?
        || req.comment.userId === req.user.id))
        next();
    else
        return res.json(AppResponseDto.buildWithErrorMessages('This comment does not belong to you'));
};

