<?php

namespace mgregory;

/* CONFIGURATION VARIABLES */

// Rename this file to config.php
// ALWAYS KEEP IT SECRET.

// Set default timezone for this server.
date_default_timezone_set('Europe/London');

$config = new stdClass;

// Define $config site variables
$config->www = 'localhost';
$config->JWT_secret = '';
