<?php

namespace mgregory\core;
/* Return an instance of an app's class
 *
 * @param string @appname Name of application
 * @param string @controller Name of class
 * @return object Class
 */

function loadClass ($appname, $class) {
	$path = dirname(dirname(__FILE__)) . '/applications/' . $appname . '/classes/' . $class . '.class.php';
	if (file_exists($path)) {
		include_once $path;
		$return = new $class();
		return $return;
	} else {
		throw new Exception ("Class $class in $appname does not exist");
	}
}

/* Load an app's controller functions
 *
 * @param string @appname Name of application
 * @param string @controller Name of controller
 * @return void
 */
function loadController ($appname, $controller) {
	$path = dirname(dirname(__FILE__)) . '/applications/' . $appname . '/controllers/' . $controller . '.controller.php';
	if (file_exists($path)) {
		require_once $path;
	} else {
		throw new Exception ("Controller $controller in $appname does not exist");
	}
}

/* Load an app's helper functions
 *
 * @param string @appname Name of application
 * @param string @helper Name of helper
 * @return void
 */
function loadHelper ($appname, $helper) {
	$path = dirname(dirname(__FILE__)) . '/applications/' . $appname . '/helpers/' . $helper . '.helper.php';
	if (file_exists($path)) {
		require_once $path;
	} else {
		throw new Exception ("Helper $helper in $appname does not exist");
	}
}
