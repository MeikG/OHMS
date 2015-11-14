<?php
namespace mgregory\auth;

$app->post('/', function () use ($app) {
	// Load the Authentication Controller
	$authController = \core\loadController('authentication', 'auth');

	// Get the username and password from the request
	$username = $app->request->post('username');
	$password = $app->request->post('password');

	// Authenticate user
	$return = controller\authenticateUser($username, $password);

	if ($return['isLoggedIn']) {
		$token = controller\GenerateToken($username);
		$app->response->headers->set('Authorization', 'Bearer ' . $token);
	}

	$app->response->headers->set('Content-Type', 'application/json');
	echo json_encode($return);
});

$app->get('/validate', function () use ($app) {
	// Authenticate
	if (\core\isValidTokenHeader($app)) {
		$return = ['isValidToken' => true];
		$app->response->headers->set('Content-Type', 'application/json');
		echo json_encode($return);/**/
	}
});
