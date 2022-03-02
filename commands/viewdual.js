const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const Discord = require('discord.js');

module.exports = {
    name: 'viewdual',
    aliases: ['vdual'],
    args: false,
    execute: async (message) => {
        // if((message.member.hasPermission('MANAGE_ROLES') || message.member.roles.cache.has('615762950933839893')) && (message.guild.id === '765523244332875776' || message.guild.id === '615297658860601403')) {
        if (message.author.id === '531548281793150987') {
            const client = new google.auth.JWT(
                keys.client_email,
                null,
                keys.private_key,
                ['https://www.googleapis.com/auth/spreadsheets']
            );

            client.authorize(function (err, tokens) {

                if (err) {
                    console.log(err);
                    return;
                }
                else {
                    console.log('Connected!');
                    gsrun(client);
                }
            });

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                const imp = {
                    spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                    range: 'Wrong Tag Info!K6:N'
                };
                let imp_data = await gsapi.spreadsheets.values.get(imp);
                let imp_array = imp_data.data.values;
                if (imp_array[0][0] === 'No Dupes') {
                    message.reply('No duals present in WCL Official Roster');
                }
                let col = '';
                imp_array.forEach(data => {
                    col += `${data[0].padEnd(4, ' ')} ${data[1].padEnd(12, ' ')} ${data[3].padEnd(2, ' ')} ${data[2].padEnd(15, ' ')}\n`;
                });

                const embed1 = new Discord.MessageEmbed()
                    .setColor('#f53704')
                    .setThumbnail('https://media.discordapp.net/attachments/766306826542514178/841324537169969172/Summer_Kickoff.png')
                    .setAuthor('By WCL')
                    .setTitle('WCL SK Tournament Duals')
                    .setDescription("```" + `Abbs #PTag        TH PName          \n\n` + col.slice(0, 1961) + "```")
                    .setTimestamp()
                message.channel.send(embed1);
                if (col.length > 1960) {
                    const embed2 = new Discord.MessageEmbed()
                        .setColor('#f53704')
                        .setThumbnail('https://media.discordapp.net/attachments/766306826542514178/841324537169969172/Summer_Kickoff.png')
                        .setAuthor('By WCL')
                        .setTitle('WCL SK Tournament Duals')
                        .setDescription("```" + `Abbs #PTag        TH PName          \n\n` + col.slice(1961, 3922) + "```")
                        .setTimestamp()
                    message.channel.send(embed2);
                }
                if (col.length > 3920) {
                    const embed3 = new Discord.MessageEmbed()
                        .setColor('#f53704')
                        .setThumbnail('https://media.discordapp.net/attachments/766306826542514178/841324537169969172/Summer_Kickoff.png')
                        .setAuthor('By WCL')
                        .setTitle('WCL SK Tournament Duals')
                        .setDescription("```" + `Abbs #PTag        TH PName          \n\n` + col.slice(3922, col.length) + "```")
                        .setTimestamp()
                    message.channel.send(embed3);
                }
            }
        }
        else {
            message.reply(`Not permitted\nOR\nWrong Server`);
        }
    }
}