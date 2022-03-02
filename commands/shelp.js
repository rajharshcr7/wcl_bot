module.exports = {
    name: 'shelp',
    aliases: ['shelp'],
    description: 'Lists the commands for staffs of WCL',
    args: false,
    execute: async (message) => {
        if (message.guild.id === '615297658860601403' || message.guild.id === '765523244332875776') {
            const com = `Developer Only\n\n
League Admins Only
wcl replace - replaces old clan_abb with new clan_abb
wcl updatedb - populates new details of clan abbreviations
wcl changeroster - to change a complete roster
wcl changesize - to resize new teams roster addition spot(author only)
wcl creps - interchange/update the clan representatives\n\n
More commands coming soon.........`
            message.channel.send('```plaintext\n' + com + '\n```');
        }
        else {
            message.reply('Not allowed to use the command here.');
        }
    }
}