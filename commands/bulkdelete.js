module.exports = {
    name : 'prune',
    description : 'bulk delete',
    length : 1,
    execute(message, args) {
            const amount = parseInt(args[0]);
    
            if(isNaN(amount)) {
                return message.reply('that doesn\'t seem to be a valid number.');
            }
            else {
                message.channel.bulkDelete(amount, true).catch(err => {
                    console.log(err);
                    message.channel.send('there was an error trying to prune messages in this channel!');
                })
            }

    }
}