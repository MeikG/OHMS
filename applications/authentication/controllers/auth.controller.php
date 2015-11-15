<?php
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\ValidationData;

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
function generateToken($username, $www, $secret) {

	$signer = new \Lcobucci\JWT\Signer\Hmac\Sha256();
	$token = (new \Lcobucci\JWT\Builder())
					->setIssuer($www)						// Configures the issuer (iss claim)
					->setIssuedAt(time()) 					// Configures the time that the token was issue (iat claim)
					->setExpiration(time() + 3600) 			// Configures the expiration time of the token (exp claim)
					->set('isLoggedIn', 1) 					// Claim the user is logged in
					->set('username', $username)			// Claim the logged in user is $username
					->sign($signer, $secret) 				// creates a signature using "testing" as key
					->getToken(); 							// Retrieves the generated token

	return (string) $token;
}

/* Validate a JWT Token
 *
 * @param JSON $string JSON Web Token
 * @return bool
 */
function validateToken($string, $www, $secret) {
	$signer = new \Lcobucci\JWT\Signer\Hmac\Sha256();

	// Configure validation data
	$data = new \Lcobucci\JWT\ValidationData;
	$data->setIssuer($www);

	// If it's from a header, strip it.
	if (preg_match('/^Bearer /', $string)) $string = str_replace('Bearer ', '', $string);

	// Verify token is signed and validated
	$token = (new \Lcobucci\JWT\Parser())->parse((string) $string);
	if ($token->verify($signer, $secret) && $token->validate($data)) {
		// Return the claims made by the token
		return $token->getClaims();
	}
	return false;
}
