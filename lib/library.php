<?php
/* Library file for setting up each page with relevant requires */

session_start();

// Show error reporting when site is running in dev mode
if ($config->reporterror == 1) {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
}

// Class autoloader
spl_autoload_register(function ($class) {
	$path = (dirname(dirname(__FILE__))) . '/classes/' . $class . '.php';
    if (file_exists ($path)) {
		include $path;
	} else {
		throw new Exception('Class does not exist');
	}
});