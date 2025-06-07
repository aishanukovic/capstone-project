const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `https://dev-lezwx11sphlq0jmd.ca.auth0.com/.well-known/jwks.json`,
  }),
  audience: 'https://capstone-api',
  issuer: `https://dev-lezwx11sphlq0jmd.ca.auth0.com/`,
  algorithms: ['RS256'],
  requestProperty: 'auth',
});

module.exports = checkJwt;