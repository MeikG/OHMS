<?php
$authController = loadController('authentication', 'auth');

$app->post('/', function () use ($app, $authController) {
	$username = $app->request->post('username');
	$password = $app->request->post('password');
});
