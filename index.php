<?php

namespace mgregory;

require 'vendor/autoload.php';

$app = new \Slim\Slim();

// Run apiRouter to set up routes
require 'library/lib.php';

$app->run();
