/**
 * Tag table creation SQL query
 * 
 * @type {string}
 */
const CreateTagTable = "CREATE TABLE IF NOT EXISTS `tags` ( `name` VARCHAR(16) NOT NULL , `created_at` BIGINT NOT NULL , PRIMARY KEY (`name`)) ENGINE = InnoDB;";

/**
 * Advertisement table creation SQL query
 * 
 * @type {string}
 */
const CreateAdvertisementTable = "CREATE TABLE IF NOT EXISTS `advertisements` ( `id` INT NOT NULL AUTO_INCREMENT , `tags` VARCHAR(128) NOT NULL , `players` INT NOT NULL , `description` TEXT NOT NULL , `expiration` BIGINT NOT NULL , `created_at` BIGINT NOT NULL , PRIMARY KEY (`id`), INDEX (`tags`), INDEX (`expiration`)) ENGINE = InnoDB;";

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
