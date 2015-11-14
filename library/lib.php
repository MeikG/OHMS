<?php

namespace mgregory;

/* Bootstrap file for API */

require_once dirname(dirname(__FILE__)) . '/library/config.php';
require_once dirname(dirname(__FILE__)) . '/helpers/appLoader.php';
require_once dirname(dirname(__FILE__)) . '/library/apiRouter.php';
require_once dirname(dirname(__FILE__)) . '/helpers/authorisation.php';

// If the configuration file has not been set up, display an error.
global $config;
if (! $config) {
	throw new \Exception('Configuration file not found. Please follow the instructions in config_default.php.');
	die();
}
