import GrouperClient from '../structures/GrouperClient';
import { getDB } from '../database';
import Tag from '../models/Tag';
import { to } from 'await-to-js';


/**
 * Load tags from database into client tag store
 * 
 * @async
 * 
 * @param {GrouperClient} client 
 */
export default async function LoadTags(client) {
    let database, err;

    [ err , database ] = await to(getDB());

    if (err) {
        setTimeout(LoadTags, 5 * 1000);

        return;
    }

    database.query("SELECT `name`, `created_at` FROM `tags`", (err, results) => {
        if (err) {
            throw err;
        }

        for (const result of results) {
            let tag = new Tag(result.name);

            tag.setCreatedAt(result.created_at);

            client.tags.set(result.name, tag);
        }

        /**
         * Emitted when tags are loaded from database
         * 
         * @event GrouperClient#tagsLoaded
         * @param {number} client.tags.size - Number of tags loaded
         */
        client.emit('tagsLoaded', client.tags.size);
    })
}
