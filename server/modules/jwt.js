const { expressjwt: jwt } = require("express-jwt");
const jwks = require('jwks-rsa');


const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-ipebb6rgmf8hkbyz.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://nodejs/api',
  issuer: 'https://dev-ipebb6rgmf8hkbyz.us.auth0.com/',
  algorithms: ['RS256']
});


module.exports = {
    jwtCheck,
}