<?php

trait singleton {
    /** @var array Singleton instances. */
    protected static $instances = array();

    /**
     * Return singleton instance of called class
     *
     * @return class instance
     */
    public static function instance() {
        $class = get_called_class();

        if (! isset(self::$instances[$class])) {
            self::$instances[$class] = new static;
        }

        return self::$instances[$class];
    }
}
