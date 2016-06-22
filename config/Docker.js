// This configuration file is for the standard Docker configuration.

module.exports.site = {
  // The domain where the cookie will be valid.
  address: process.env.SITE_ADDRESS || 'http://localhost:1337',

  // The domain where the cookie will be valid.
  //address: process.env.SITE_ADDRESS || 'http://localhost:1337'

  // Define if the site is allowing users to sign up.
  allowSignups: (process.env.SITE_ALLOW_SIGNUPS === 'true' ? true : false) || false
};

module.exports.jwt = {
  // Set the name of the cookie.
  cookieName: process.env.SITE_COOKIENAME || 'authcookie',

  // SET AUTH_JWT_SECRET or your site will not be secure (or stateless)!
  secret: process.env.SITE_JWT_SECRET || Math.random().toString(36).substr(2),

  // The audience for the JWT.
  audience: process.env.SITE_JWT_AUDIENCE || '.localhost',

  // How long the JWT will be valid for.
  validFor: process.env.SITE_JWT_VALIDFOR || '1h',

  // Percentage of valid age before JWT is reissued.
  reissuePercent: process.env.SITE_JWT_REISSUEPERCENT || '25'
};

module.exports.connections = {
  // The Docker stack uses a MySQL database.
  MysqlServer: {
    adapter: process.env.SITE_DATABASE_ADAPTER,
    host: process.env.SITE_DATABASE_HOST,
    user: process.env.SITE_DATABASE_USER,
    password: process.env.SITE_DATABASE_PASSWORD,
    database: process.env.SITE_DATABASE_NAME
  }
};
