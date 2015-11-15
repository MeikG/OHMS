<?php
namespace mgregory\auth;

$app->post('/', function () use ($app) {
	global $config;

	// Load the Authentication Controller
	$authController = \mgregory\core\loadController('authentication', 'auth');

	// Get the username and password from the request
	$username = $app->request->post('username');
	$password = $app->request->post('password');

	// Authenticate user
	$return = controller\authenticateUser($username, $password);

	if ($return['isLoggedIn']) {
		$token = controller\GenerateToken($username, $config->www, $config->JWT_secret);
		$app->response->headers->set('Authorization', 'Bearer ' . $token);
		$return['token'] = $token;
	}

	$app->response->headers->set('Content-Type', 'application/json');
	echo json_encode($return);
});

$app->get('/validate', function () use ($app) {
	// Authenticate
	if ($claims = \mgregory\core\isValidTokenHeader($app)) {
		$return = ['isValidToken' => true];
		$return['claims'] = $claims;
		$app->response->headers->set('Content-Type', 'application/json');
		echo json_encode($return);/**/
	}
});
