<?php

namespace mgregory\ohms;

/* URL: /ohms/recipe */

/* GET all recipes
 *
 * @return JSON
 */
$app->get('/', function () use ($app) {
	// This is a privileged action
	if ($claims = \mgregory\core\isValidTokenHeader($app)) {
		// Return all the recipes that $claims['username'] is allowed to see.
	}
});

/* GET a specific recipe
 *
 * @return JSON
 */
$app->get('/:recipe', function ($recipe) use ($app) {
	if ($claims = \mgregory\core\isValidTokenHeader($app)) {
		// If user is allowed to see recipe, return it as a JSON.
		// Otherwise return 401.
	}
});
