<?php
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Hmac\Sha256;

namespace mgregory\auth\controller;


/* Authenticate user details against database
 *
 * @param string $username Username
 * @param string $password Password
 * @return bool
 */
function authenticateUser($username, $password) {
	$return = ['isLoggedIn' => false];

	// Validate credentials and return variables
	if (1) {
		$return['isLoggedIn'] = true;
		$return['username'] = $username;
	}

	// Return data
	return $return;
}

/* Generate a JSON Web Token for a user
 *
 * @param string $username Username
 * @return string JWT
 */
function generateToken($username) {
	global $config;
	$signer = new \Lcobucci\JWT\Signer\Hmac\Sha256();

	$token = (new \Lcobucci\JWT\Builder())
					->setIssuer($config->www)				// Configures the issuer (iss claim)
					->setIssuedAt(time()) 					// Configures the time that the token was issue (iat claim)
					->setExpiration(time() + 3600) 			// Configures the expiration time of the token (exp claim)
					->set('isLoggedIn', 1) 					// Claim the user is logged in
					->set('username', $username)			// Claim the logged in user is $username
					->sign($signer, $config->JWT_secret) 	// creates a signature using "testing" as key
					->getToken(); 							// Retrieves the generated token

	return $token;
}

/* Validate a JWT Token
 *
 * @param JSON $string JSON Web Token
 * @return bool
 */
function validateToken($string) {
	global $config;
	$signer = new \Lcobucci\JWT\Signer\Hmac\Sha256();

	// If it's from a header, strip it.
	if (preg_match('/^Bearer /', $string)) $string = str_replace('Bearer ', '', $string);

	// Verify token
	$token = (new \Lcobucci\JWT\Parser())->parse((string) $string);
	if ($token->verify($signer, $config->JWT_secret)) {
		return true;
	}
	return false;
}
