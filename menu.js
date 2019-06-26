const Discord = require('discord.js');

class DiscordMessageMenu {
    constructor(authormessage, title, color, displaycount) {
        this.menu = [];
        this.page = 0;
        this.left = '◀';
        this.stop = '🛑';
        this.right = '▶';
        this.bullet = '•'
        this.authormessage = authormessage;
        this.message = null;
        this.displaycount = displaycount;
        this.title = title;
        this.color = color;
        this.targetid = authormessage.author.id;
        this.timeout = null;
        this.collector = null;
        this.taglist = false;
    }

    /**
     * Determines how the menu should be built. Tags should display a different embed.
     * @param {Boolean} taglist 
     */
    setTagList(taglist) {
        this.taglist = taglist;
    }

    /**
     * Builds the menu items & formats them. This must be called
     * before the call to displayPage().
     * 
     * @param {Array} items 
     */
    buildMenu(items) {
        items.forEach((element, i) => {
            this.menu.push(element);
        });

        // reset page to 0
        this.page = 0;
    }

    getMaxPage() {
        return Math.ceil(this.menu.length/this.displaycount) - 1;
    }

    handleMessage(result, that, items) {
        if (this.getMaxPage() == 0)
            return;

        that.message = result;
        if (!result.reactions.find((x) => x.emoji.name == that.stop)) {
            result.react(that.left).then(result => { // left first
                result.message.react(that.stop).then(result => { // then stop
                    result.message.react(that.right).then((result) => { 
                    }).catch(); // then right
               }).catch();
            }).catch();
        }

        // used after creation of collector to determine whether or not
        // this is the first call to handleMessage()
        let first = that.collector == null;

        // Reactions
        that.collector = result.createReactionCollector((reaction, user) => {
            if  (that.targetid == user.id
            && (reaction.emoji.name === that.left
            || reaction.emoji.name == that.stop
            || reaction.emoji.name == that.right)) {
                that.collectionuser = user;
                return true;
            }
            return false;
        }
        ).once("collect", reaction => {
            const chosen = reaction.emoji.name;
            if (chosen == that.left) {
                if (that.page > 0)
                    that.displayPage(--that.page)
                else
                    that.displayPage(that.page)
            }
            else if (chosen == that.right) {
                if (that.page + 1 > that.getMaxPage())
                    that.displayPage(that.page)
                else
                    that.displayPage(++that.page);
            }
            else if (chosen == that.stop) {
                result.clearReactions().then((r) => that.collector.stop());
                that.timeout.stop();
                return;
            }
            that.timeout.restart();
            reaction.remove(that.collectionuser).catch();
        });

        if (first) {
            that.timeout = new MessageTimeout(result, that.collector);
            that.timeout.start();
        }
    }

    displayPage(page) {
        // Pagination building
        let start = page * this.displaycount;
        let end = start + this.displaycount;
        let items = this.menu.slice(start, end);

        // Message dispatch
        let embed = new Discord.RichEmbed();
        
        // put every item on it's own line
        let output = "";
        if (!this.taglist) {
            embed.setTitle(this.title)
            embed.setThumbnail("https://images.emojiterra.com/twitter/v12/512px/1f4cb.png")
            embed.setColor(this.color)
            embed.setFooter("Requested by: " + this.authormessage.author.tag + ' | page: ' + (this.page+1) + '/' + (this.getMaxPage()+1));
    
            items.forEach(element => {
                if (element["playernum"] > 1) {
                    embed.addField( `${element["author"]} (${element["playernum"]} players needed)`,`	\`\`\`\n${element["description"]}\`\`\` \n\n`,false )
                } else {
                    embed.addField( `${element["author"]} (${element["playernum"]} player needed)`,`	\`\`\`\n${element["description"]}\`\`\` \n\n`,false )
                }
            });
        } else {
            this.authormessage.channel.send('Here\'s our list of available tags, think we missed one? Contact us with: ').then().catch(console.log)
            embed.setTitle(this.title)
            embed.setThumbnail("https://images.emojiterra.com/google/android-oreo/128px/1f4bd.png")
            embed.setColor(this.color)
            embed.setFooter("Requested by: " + this.authormessage.author.tag + ' | page: ' + (this.page+1) + '/' + (this.getMaxPage()+1));
            let description = "";
            items.forEach(element => {
                description += `${this.bullet} ${element} \n`;
            });
            embed.setDescription(description);
        }

        if (!this.message) { // we haven't already sent one, so send()
            let that = this;
            this.message = this.authormessage.channel.send(embed)
            .then(result => that.handleMessage(result, that, items))
            .catch();
        }
        else { // we *did* send one, so edit()
            let that = this;
            this.message.edit(embed)
            .then(result => that.handleMessage(result, that, items))
            .catch();
        }
    }
}

class MessageTimeout {
    constructor(message, collector, delay) {
        this.message = message;
        this.collector = collector
        this.delay = delay;
        this.timeout = null;
    }

    start() {
        this.timeout = setTimeout(this.run, 30 * 1000, this.message, this.collector);
    }

    stop() {
        clearTimeout(this.timeout);
    }

    run(message, collector) {
        message.clearReactions().then(result => collector.stop()).catch();
    }

    restart() {
        clearTimeout(this.timeout);
        this.start();
    }
}
module.exports = DiscordMessageMenu;