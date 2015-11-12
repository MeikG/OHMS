<?php

// TODO: find fix for globals
global $applicationPrefix;
global $routerPath;

// Find all applications used by this API
$routes = glob(dirname(dirname(__FILE__)) . '/applications/*');

foreach ($routes as $applicationPrefix) {
	// Get individual name of application
	$groupName = str_replace(dirname(dirname(__FILE__)) . '/applications', '', $applicationPrefix);

	// Restrict applications to their own URL
	$app->group($groupName, function () use ($app) {
		global $applicationPrefix;
		global $routerPath;

		// Find all routers used within this application
		$routers = glob($applicationPrefix . '/routers/*.router.php');
		foreach ($routers as $routerPath) {
			// Extract router name
			preg_match("/(?<=routers[\\/])(\w*)(?=.router.php)/", $routerPath, $routerName);

			// Route the index.router.php file to /application
			if ($routerName[0] == 'index') {
				require $routerPath;
			} else {
				// Restrict routers to routing name
				$app->group('/' . $routerName[0], function () use ($app) {
					global $routerPath;
					require $routerPath;
				});
			}


		}

	});

}
