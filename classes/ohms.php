<?php

class ohms {
	use singleton;
	
	private $var_array = array();
	
	const USER_SYSTEM = 0;
	
	/* OHMS class constructor */
	private function __construct() {
		$this->var_array = $_GET;
	}
	
	/* Sets a page variable (PERMANENT)
	 *
	 * @param string @key Key
	 * @param string @value Value
	 * @return void
	 */
	public function set_pagevar($key, $value) {
		if ($value) {
			$this->var_array[$key] = $value;
		} else {
			unset($this->var_array[$key]);
		}
	}
	
	/* Retrieves a page variable
	 *
	 * @param string @key Key
	 * @param string @value Value
	 * @return string
	 */
	public function get_pagevar($key) {
		if (isset($this->var_array[$key])) {
			return $this->var_array[$key];
		} else {
			return null;
		}
	}
	
	/* Encode an associative array to web format
	 *
	 * @param array $array Array to encode
	 * @return array
	 */
	private function urlencode_pagevar(array $array) {
		$return = array();
		foreach ($array as $key => $value) {
			$return[urlencode($key)] = urlencode($value);
		}
		return $return;
	}
	
}
