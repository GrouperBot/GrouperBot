module.exports.run = async (client, message, args, prefix) => {
    message.channel.sendMessage('test!')
    .then().catch(console.error);
}

module.exports.help = {
    name:"help",
    description:"displays all commands",
    dev: false
}