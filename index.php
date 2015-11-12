<?php
require 'vendor/autoload.php';

$app = new \Slim\Slim();

// Run apiRouter to set up routes
require 'library/apiRouter.php';

$app->run();
