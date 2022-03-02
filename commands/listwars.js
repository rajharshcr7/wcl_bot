const fetch = require('node-fetch');
const PaginationEmbed = require('discord-paginationembed');
const Discord = require('discord.js');

module.exports = {
    name: 'listwars',
    aliases: ['lw', 'getwars'],
    description: 'Lists the scheduled wars prior to the week being searched',
    args: true,
    length: 1,
    category: 'Admins, Represenratives',
    missing: ['`week.prefix`'],
    usage: 'week.prefix',
    explanation: 'Ex: wcl getwars wk1\n\nwhere wk1 is week prefix or week identifier',
    execute: async (message, args) => {
        // if(!(message.channel.id === '842739523384901663' || message.channel.id === '842738408648474695' || message.channel.id === '842738445259898880' || message.channel.id === '842738468743413780'))
        if (message.author.id === '531548281793150987') {
            const options = {
                'json': true,
                'Accept': 'application/json',
                'method': 'get',
                'muteHttpExceptions': true
            };

            const week_identifier = {
                'wk1': 'A2:J',
                'wk2': 'A2:J',
                'wk3': 'A2:J',
                'wk4': 'A2:J',
                'wk5': 'A2:J',
                'r32': 'A2:F',
                'wc': 'A2:J',
                'qf': 'A2:J',
                'sf': 'A2:J',
                'f': 'A2:J',
            };
            const resource = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1XYbVO9LQ-gGzspqdmsQeHHlJPECbt4EO_jqXpeLzLGU/values/${args[0].toUpperCase()}!${week_identifier[args[0].toLowerCase()]}?majorDimension=ROWS&key=YOURAPIKEY`, options);
            if (resource.status === 200) {
                const resource_values = await resource.json();//to parse the json payload to JavaScript object
                let pirates = '';
                let blizzard = '';
                if (!(resource_values.values === undefined)) {
                    resource_values.values.forEach(data => {
                        if (!(data[0] === undefined)) {
                            pirates += `${data[0].padEnd(4, ' ')} ${data[1].padEnd(4, ' ')} ${data[2].padEnd(15, ' ')} ${data[3].padEnd(15, ' ')}\n`;
                        }
                        if (!(data[6] === undefined)) {
                            blizzard += `${data[6].padEnd(4, ' ')} ${data[7].padEnd(4, ' ')} ${data[8].padEnd(15, ' ')} ${data[9].padEnd(15, ' ')}\n`;
                        }
                    });
                    const embed = [];
                    if (pirates.length > 0) {
                        const embed1 = new Discord.MessageEmbed()
                            .setAuthor('By WCL TECHNICAL')
                            .setTitle(`Preview for scheduled wars of ${args[0].toUpperCase()}`)
                            .setColor('#93ad22')
                            .setDescription("```" + `#ID  #WK  Clan For        Clan Against\n\n` + pirates.slice(0, 1974) + "```")
                            .setTimestamp()
                        embed.push(embed1);
                    }
                    if (pirates.length > 1974) {
                        const embed2 = new Discord.MessageEmbed()
                            .setAuthor('By WCL TECHNICAL')
                            .setTitle(`Preview for scheduled wars of ${args[0].toUpperCase()}`)
                            .setColor('#93ad22')
                            .setDescription("```" + `#ID  #WK  Clan For        Clan Against\n\n` + pirates.slice(1974, pirates.length) + "```")
                            .setTimestamp()
                        embed.push(embed2)
                    }
                    if (blizzard.length > 0) {
                        const embed3 = new Discord.MessageEmbed()
                            .setAuthor('By WCL TECHNICAL')
                            .setTitle(`Preview for scheduled wars of ${args[0].toUpperCase()}`)
                            .setColor('#ffcd0b')
                            .setDescription("```" + `#ID  #WK  Clan For        Clan Against\n\n` + blizzard.slice(0, blizzard.length) + "```")
                            .setTimestamp()
                        embed.push(embed3);
                    }
                    if (embed.length > 0) {
                        let m = 0;
                        embed.map(function (r) { m++; return r.setFooter(`Page ${m}/${embed.length}`) });
                        const Embeds = new PaginationEmbed.Embeds()
                            .setArray(embed)
                            .setTimeout(600000)
                            .setChannel(message.channel)
                            .setDeleteOnTimeout(false)
                            .setDisabledNavigationEmojis(['back', 'forward', 'jump', 'delete'])
                            .setFunctionEmojis({
                                '⏮️': (_, instance) => {
                                    instance.setPage(1);
                                },
                                '◀️': (_, instance) => {
                                    instance.setPage('back');
                                },
                                '▶️': (_, instance) => {
                                    if (embed.length > 1) {
                                        instance.setPage('forward');
                                    }
                                    else {
                                        instance.setPage(1);
                                    }
                                },
                                '⏭️': (_, instance) => {
                                    instance.setPage(embed.length);
                                },
                                '🔃': (_, instance) => {
                                    instance.deleteFunctionEmoji();
                                }
                            })
                        await Embeds.build();
                    }
                }
                else {
                    message.reply(`No wars scheduled for **${args[0].toUpperCase()}**!`);
                }
            }
            else {
                message.reply(`Something went wrong`);
            }
        }
        else {
            message.reply(`Not an appropriate channel to run the command.`);
        }
    }
}