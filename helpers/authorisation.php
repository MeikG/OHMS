<?php

namespace mgregory\core;

function isValidTokenHeader($app) {
	// Set up Authorisation Controller
	$authController = \core\loadController('authentication', 'auth');

	// Get token
	if ($token = $app->request->headers->get('Authorization')) {

		if (\auth\controller\validateToken($token)) {
			return true;
		}
	}
	$app->response->setStatus(401);
	return false;
}
