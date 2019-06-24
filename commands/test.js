module.exports.run = async (client, message, args, prefix) => {
    message.channel.sendMessage('yofou!')
    .then().catch(console.error);
}

module.exports.test = {
    name:"test",
    description: "displays all commands",
    dev: true
}
