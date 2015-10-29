<?php

class conn {
	use singleton;

	/* Checks if a user is allowed to see/interact with this record.
	 *
	 * @param string @table Table
	 * @param int @record ID of record
	 *
	 * @return bool
	 */
	public function check_authority(string $table, int $record, $user = null) {
		$user = user::instance();

		// If the request comes from the system, grant authority.
		if ($user === $ohms::USER_SYSTEM) return true;
		/* ^^^ ENSURE THIS IS SECURE ^^^ */

		// If no user specified, default to the logged in user.
		if (! $user) $user = $user->id;

		// Does a record for this table/record/user exist in authority table?
		if ($conn->query('SELECT * FROM `user_authority` WHERE table = %s AND record = %i AND user = %i', array($table, $record, $user))) {
			return true;
		}

		throw new Exception ("user $user is not allowed to perform this action");
		return false; // probably redundant since the exception should halt execution
	}

	/* Grants authority for a user
	 *
	 * @param string @table Table
	 * @param int @record ID of record
	 *
	 * @return bool
	 */
	private function grant_authority(string $table, int $record, $user = null) {
		$user = user::instance();

		if (! $user) $user = $user->id;

		// Check to see if the logged in user is allowed to access this item
		if ($this->check_authority($table, $record)) {
			// Check to make sure they don't already have authority
			if (! $this->check_authority($table, $record, $user)) {
				// INSERT RECORD INTO `user_authority` TABLE
				$conn->query('INSERT INTO `user_authority` (table, record, user) VALUES (%s, %i, %i)', array($table, $record, $user));
			}
		} else {
			throw new Exception ("you are not allowed to perform this action");
		}

	}

	/* Revokes authority for a user
	 *
	 * @param string @table Table
	 * @param int @record ID of record
	 *
	 * @return bool
	 */
	private function revoke_authority(string $table, int $record, $user = null) {
		$user = user::instance();

		if (! $user) $user = $user->id;

		// Check to see if the logged in user is allowed to access this item
		if ($this->check_authority($table, $record)) {
			// Check to make sure they have authority
			if ($this->check_authority($table, $record, $user)) {
				// DELETE RECORD FROM `user_authority` TABLE
				$conn->query('DELETE FROM `user_authority` WHERE table = %s AND record = %i AND user = %i', array($table, $record, $user));
			}
		} else {
			throw new Exception ("you are not allowed to perform this action");
		}
	}

	/* DATABASE FUNCTIONS */

	/* Query the SQL database
	 *
	 * @param string $sql SQL command
	 * @param array $param Variables
	 *
	 * @return StdObject
	 */
	public function query(string $sql, array $param) {
		// CODE
	}

	/* Select record(s) from the database
	 *
	 * @param string $table Table to access
	 * @param array $where Conditions for the record
	 * @param int $limit Limit Records to return
	 * @param string $order Order of records
	 *
	 * @return StdObject
	 */
	public function select_record(string $table, array $where, int $limit = null, string $order = null) {
		// CODE
	}

	/* Insert a record into the database
	 *
	 * @param string $table Table to access
	 * @param array $param Values of fields
	 *
	 * @return StdObject
	 */
	public function insert_record(string $table, array $params) {
		// CODE
	}

	/* Update record(s) in the database
	 *
	 * @param string $table Table to access
	 * @param array $param New values
	 * @param array $where Conditions for the record(s) to update
	 *
	 * @return StdObject
	 */
	public function update_record($sql, array $params, array $where) {
		// CODE
	}

	/* Delete record(s) from the SQL database
	 *
	 * @param string $table Table to access
	 * @param array $where Conditions for the record(s) to delete
	 *
	 * @return StdObject
	 */
	public function remove_record($sql, array $array) {
		// CODE
	}
}
