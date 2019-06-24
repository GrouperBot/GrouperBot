module.exports.run = async (client, message, args, prefix) => {
    message.channel.sendMessage('yofou!')
    .then().catch(console.error);
}

<<<<<<< HEAD
module.exports.help = {
    name:"test",
    description: "displays all commands",
    dev: false
=======
module.exports.test = {
    name:"test",
    description: "displays all commands",
    dev: true
>>>>>>> 01821ddbe43e8243996998d7328613fd6777e886
}
