<?php

/* Configuration file for OHMS.
 * Please fill out all relevant fields.
 */

class config {
    
	/* SITE CONFIGURATION */
	
	// URL where site is hosted
	public $www = 'localhost';
	
	// Enable error reporting?	
	public $reporterror = 0;
	
	/* MySQL DATABASE CONFIGURATION */
	
	// Database host
	public $dbhost = '';
	
	// Database username
	public $dbuser = '';
	
	// Database password
	public $dbpass = '';
	
	// Database name
	public $dbname = '';
}
 
$config = new config;
require_once(dirname(__FILE__) . '/lib/library.php');