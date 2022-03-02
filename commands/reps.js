const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'claninfo',
    aliases: ['cinfo', 'clan', 'reps'],
    description: 'Shows you the clan representatives for a WCL Clan',
    args: true,
    length: 1,
    category: 'representative',
    usage: 'wcl reps clanAbb',
    missing: ['`clanAbb`'],
    explanation: 'Ex: wcl reps INQ\nwhere INQ - clanAbb\n\nOptional\nUsing tr after putting clanAbb would help you to get the rep pinged!',
    execute: async (message, args) => {
        const color = {
            'HEAVY WEIGHT': '#008dff',
            'FLIGHT': '#3f1f8b',
            'ELITE': '#a40ae7',
            'BLOCKAGE': '#fc3902',
            'CHAMPIONS': '#ffb014',
        }
        const logo = {
            'HEAVY WEIGHT': 'https://media.discordapp.net/attachments/914077029912170577/914443975107153920/WCL_Heavy.png?width=539&height=612',
            'FLIGHT': 'https://media.discordapp.net/attachments/914077029912170577/914442651992989736/WCL_Flight.png?width=530&height=612',
            'ELITE': 'https://media.discordapp.net/attachments/914077029912170577/914442651690991616/WCL_ELITE.png?width=514&height=612',
            'BLOCKAGE': 'https://media.discordapp.net/attachments/914077029912170577/914442652315963402/WCL_Blockage_.png?width=435&height=613',
            'CHAMPIONS': 'https://media.discordapp.net/attachments/914077029912170577/914442651238039572/WCL_Champions.png?width=548&height=612',
        }
        if (!(message.channel.id === '941944701358047292' || message.channel.id === '941944848771080192' || message.channel.id === '941944931382075422' || message.channel.id === '941944985211772978' || message.channel.id === '941943218721923072' || message.channel.id === '941943402482782218' || message.channel.id === '941943477258842122')) {
            var repSchema = require('./repsSchema/repsSchema');
            var ABBSobject = fs.readFileSync('./commands/abbs.json');
            var abbObject = JSON.parse(ABBSobject);

            let division = '';
            var repList = [];
            abbObject.values.forEach(data => {
                if (args[0].toUpperCase() === data[2]) {
                    division = data[3];
                    data.forEach(val => {
                        repList.push(val);
                    });
                }
            });

            if (division === '') {
                return message.reply(`Invalid clan abb ${args[0].toUpperCase()}!`);
            }

            var findRepList = await repSchema.find({ div: division });
            findRepList[0].values.forEach(data => {
                if (data[0] === args[0].toUpperCase()) {
                    data.forEach(val => {
                        repList.push(val);
                    });
                    repList.splice(4, 1);
                }
            });
            let rep2 = []; //to avoid embed for breaking due to missing field params of second rep
            if (repList.length === 6) {
                rep2.push('N/A', 'N/A');
            }
            else {
                rep2.push(repList[6], repList[7]);
            }
            if (args.length === 1) {
                const embed = new Discord.MessageEmbed()
                    .setColor(color[division])
                    .setThumbnail(logo[division])
                    .setAuthor('WCL TECHNICAL', 'https://media.discordapp.net/attachments/766306691994091520/804653857447477328/WCL_BOt.png')
                    .setTitle(`*Clan Info of ${repList[1]}*`)
                    .addField('Clan name<:cc:944312115643166720>', repList[1])
                    .addField('Clan tag:hash:', `[${repList[0]}](https://link.clashofclans.com/?action=OpenClanProfile&tag=%23${repList[0].slice(1)})`)
                    .addFields(
                        {
                            name: 'Representative:one:',
                            value: repList[4],
                        },
                        {
                            name: 'Discord🆔',
                            value: repList[5],
                        },
                        {
                            name: 'Representative:two:',
                            value: rep2[0],
                        },
                        {
                            name: 'Discord🆔',
                            value: rep2[1],
                        }
                    )
                    .setTimestamp()
                await message.channel.send(embed);
            }
            else if (args[1].toLowerCase() === 'tagreps' || args[1].toLowerCase() === 'tr') {
                const embed = new Discord.MessageEmbed()
                    .setColor(color[division])
                    .setTitle(repList[2])
                    .setDescription(`Rep1 - ${repList[4]}\nRep2 - ${rep2[0]}`)
                message.channel.send(embed).then((msg) => {
                    setTimeout(function () {
                        msg.edit(`${repList[2]}\nRep1 - <@${repList[5]}>\nRep2 - <@${rep2[1]}>`)
                    }, 1000)
                });
            }
        }
    }
}