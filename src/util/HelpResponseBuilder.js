import ResponseBuilder from '../util/ResponseBuilder';

/**
 * Abstract: Simple embed response builder for help actions
 * 
 * @class HelpResponseBuilder
 */

export default class HelpResponseBuilder extends ResponseBuilder {

    /**
     * Builds a new help response
     * 
     * @param {BuilderOptions} options 
     */
    constructor(options = {}) {
        super(options);
    }

    addField(name, value) {
        super.addField(name, `${value}\n\u200B`, false);
    }
}
