<?php

namespace mgregory\core;

function isValidTokenHeader($app) {
	global $config;

	// Set up Authorisation Controller
	$authController = loadController('authentication', 'auth');

	// Get token
	if ($token = $app->request->headers->get('Authorization')) {

		// Validate claims against the auth controller
		if ($claims = \mgregory\auth\controller\validateToken($token, $config->www, $config->JWT_secret)) {
			// If validated, return the claims made by the token.
			return $claims;
		}
	}
	// If not, return unauthorised and no claims.
	$app->response->setStatus(401);
	return false;
}
