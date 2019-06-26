/**
 * Tag table creation SQL query
 * 
 * @type {string}
 */
const CreateTagTable = "CREATE TABLE IF NOT EXISTS `tags` ( `name` VARCHAR(32) NOT NULL , `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`name`)) ENGINE = InnoDB;";

/**
 * Advertisement table creation SQL query
 * 
 * @type {string}
 */
const CreateAdvertisementTable = "CREATE TABLE IF NOT EXISTS `advertisements` ( `id` INT NOT NULL AUTO_INCREMENT , `tag` VARCHAR(32) NOT NULL , `players` INT NOT NULL , `description` TEXT NOT NULL , `expiration` TIMESTAMP NOT NULL , `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`), INDEX (`tag`)) ENGINE = InnoDB;";

/**
 * Regex for parsing arguments
 * 
 * @type {RegExp}
 */
const ArgRegex = /(?:[^\s"]+|"[^"]*")+/g

export {
    CreateTagTable,
    CreateAdvertisementTable,
    ArgRegex,
};
