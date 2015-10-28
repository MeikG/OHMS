<?php

class recipe {

    use singleton;

    protected $recipe = null;

    /* Add an ingredient to this recipe.
     * @var id $id ID of ingredient
     * @return bool
     */
    public function add_ingredient (int $id) {
        // Create a connection to the database & user class
        $conn = conn::instance(); // TODO
        $user = user::instance(); // TODO

        // Check to see if ingredient exists
        if ($conn->select_record('ingredient', array('id' => $id, 'user_id' => $user->id))) {
            // See if we've already got one for this recipe/ingredient/user
            if ($conn->select_record('recipe_ingredient', array('recipe' => $this->recipe->id, 'ingredient' => $id, 'user_id' => $user->id))) {
                $conn->insert_record('recipe_ingredient', array('recipe' => $this->recipe->id, 'ingredient' => $id, 'user_id' => $user->id));
                return true;
            } else {
                // It's a duplicate, so we don't need to do anything
                return false;
            }
        } else {
            throw new Exception ("ingredient $id does not exist");
        }
    }

    /* Remove an ingredient from this recipe.
     * @var id $id ID of ingredient in recipe_ingredient table
     * @return void
     */
    public function remove_ingredient (int $id) {
        // Check to see if ingredient exists
        if ($conn->select_record('recipe_ingredient', array('id' => $id, 'user_id' => $user->id))) {
            // See if we've already got one for this recipe/ingredient/user
            $conn->remove_record('recipe_ingredient', array("id" => $id, "user_id" => $user->id));
        } else {
            throw new Exception ("ingredient $id does not exist");
        }
    }

    /* Update a quantity of a certain ingredient
     * @var int $id ID of ingredient
     * @var int $quantity Quantity of ingredient
     * @return void
     */
    public function update_quantity_of_ingredient (int $id, int $quantity) {
        // Create a connection to the database & user class
        $conn = conn::instance();
        $user = user::instance();

        // Check to see if ingredient is in recipe
        if ($result = $conn->select_record('recipe_ingredient', array('recipe' => $this->recipe->id, 'ingredient' => $id, 'user_id' => $user->id), 1)) {
            $conn->update_record('recipe_ingredient', array('id' => $result->id), array('quantity' => $quantity));
        } else {
            throw new Exception ("ingredient $id is not in this recipe");
        }
    }
}
