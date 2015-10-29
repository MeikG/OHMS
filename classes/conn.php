<?php

class conn {
	use singleton;

	/* Checks if a user is allowed to see/interact with this record.
	 * @param string @table Table
	 * @param int @record ID of record
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
		if ($conn->query('SELECT * FROM `user_authority` WHERE table = %s AND record = %i AND user = %i', array($table, $record, $user->id))) {
			return true;
		}

		throw new Exception ("user $user is not allowed to perform this action");
		return false; // probably redundant since the exception should halt execution
	}

	/* Grants authority for a user
	 * @param string @table Table
	 * @param int @record ID of record
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
			}
		} else {
			throw new Exception ("you are now allowed to perform this action");
		}

	}

	/* Revokes authority for a user
	 * @param string @table Table
	 * @param int @record ID of record
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
			}
		} else {
			throw new Exception ("you are now allowed to perform this action");
		}
	}
}
