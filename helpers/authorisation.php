<?php

namespace mgregory\core;

function isValidTokenHeader($app) {
	global $config;

	// Set up Authorisation Controller
	$authController = loadController('authentication', 'auth');

	// Get token
	if ($token = $app->request->headers->get('Authorization')) {

		if (\mgregory\auth\controller\validateToken($token, $config->JWT_secret)) {
			return true;
		}
	}
	$app->response->setStatus(401);
	return false;
}
