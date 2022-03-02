const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: 'warinfo',
    aliases: ['warinfo', 'winfo', 'sinfo'],
    description: 'Info about a scheduled war',
    args: true,
    length: 1,
    missing: ['`war.ID`'],
    usage: 'war.ID',
    explanation: 'Ex: wcl warinfo 1000\n\nwhere 1000 is the 4 digit number of a scheduled war',
    execute: async (message, args) => {
        // if(!(message.channel.id === '842739523384901663' || message.channel.id === '842738408648474695' || message.channel.id === '842738445259898880' || message.channel.id === '842738468743413780'))
        if (message.author.id === '531548281793150987') {
            const options = {
                'json': true,
                'Accept': 'application/json',
                'method': 'get',
                'muteHttpExceptions': true
            };
            const color = {
                'PIRATES': '#93ad22',
                'BLIZZARD': '#ffcd0b'
            };
            const logo = {
                'BLIZZARD': 'https://media.discordapp.net/attachments/766306826542514178/841324500024688660/Blizzard_Division.png?width=495&height=612',
                'PIRATES': 'https://media.discordapp.net/attachments/766306826542514178/841324525954138192/Pirates_Division.png'
            };
            const resource = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1XYbVO9LQ-gGzspqdmsQeHHlJPECbt4EO_jqXpeLzLGU/values/Schedules!A2:J?majorDimension=ROWS&key=YOURAPIKEY`, options);
            if (resource.status === 200) {
                const resource_values = await resource.json();
                let found = 0;
                let index = 0;
                let array = [];
                resource_values.values.forEach(data => {
                    if (data[0] === args[0].toUpperCase() && found === 0) {
                        array.push(resource_values.values[index].map(function (r) { return r === undefined ? '-' : r; }));
                        found++;
                    }
                    index++;
                });
                array.map(function (r) { while (r.length < 10) { r.push('-'); } return r; });
                const embed = new Discord.MessageEmbed()
                    .setAuthor('By WCL TECHNICAL')
                    .setColor(color[array[0][1]])
                    .setTitle(`Schedule info of warID : **${array[0][0]}**`)
                    .setThumbnail(logo[array[0][1]])
                    .addField('Division', array[0][1], false)
                    .addField('Week', array[0][2], false)
                    .addField('Clan 1', array[0][3], true)
                    .addField('Clan 2', array[0][4], false)
                    .addField('Scheduled On', ':calendar: ' + array[0][5], true)
                    .addField('Time(EST)', ':clock1: ' + array[0][6], false)
                    .addField('Duration', ':timer: ' + array[0][7], false)
                    .addField('Scheduled By', '<@' + array[0][8] + '>', false)
                    .addField('Agreed By', '<@' + array[0][9] + '>', false)
                    .setTimestamp()
                    .setFooter('Agreed Time will be in EST Time Zone!')
                message.channel.send(embed);
            }
            else {
                message.reply(`Something went wrong.`);
            }
        }
        else {
            message.reply(`Not an appropriate channel for the command to run!`);
        }
    }
}