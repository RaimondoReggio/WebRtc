const { expressjwt: jwt } = require("express-jwt");
const jwks = require('jwks-rsa');

// Modulo utilizzato per validare il JWT
// il secret è conservato da Auth0, si accede tramite il .json
const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-bswl63fq86v48oa2.eu.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://nodejs/api',
  issuer: 'https://dev-bswl63fq86v48oa2.eu.auth0.com/',
  algorithms: ['RS256']
});


module.exports = {
    jwtCheck,
}