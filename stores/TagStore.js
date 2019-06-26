import DataStore from "./DataStore";
import GrouperClient from "../structures/GrouperClient";

export default class TagStore extends DataStore {

    /**
     * Creates new store for tags
     * 
     * @param {GrouperClient} client 
     */
    constructor(client) {
        super(client);
    }
}