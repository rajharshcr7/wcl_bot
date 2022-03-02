const fetch = require('node-fetch');
const fs = require('fs');
const paginationembed = require('discord-paginationembed');
const Discord = require('discord.js');
module.exports = {
    name: 'roster',
    aliases: ['rs'],
    description: `Helps to see you a clan's roster`,
    args: true,
    length: 1,
    category: 'representative',
    usage: 'clanAbb',
    missing: ['`clanAbb`'],
    explanation: 'Ex: wcl rs INQ',
    execute: async (message, args) => {
        const options = {
            'contentType': 'application/json',
            'method': 'get',
            'muteHttpExceptions': true,
            // 'headers': { 'Accept': 'application/json', 'authorization': `Bearer ${token}`}
        };

        async function getPlayerDetail(tag) {
            const getData = await fetch(`https://api.clashofstats.com/players/${tag.slice(1)}`, options)
            if (getData.status === 404) {
                return { name: 'N/A', townHallLevel: -1 };
            }
            else if (getData.status === 500) {
                return { name: 'U/C', townHallLevel: -1 };
            }
            else if (getData.status === 200) {
                const freshData = await getData.json();
                return freshData;
            }
        }

        if (!(message.channel.id === '941944701358047292' || message.channel.id === '941944848771080192' || message.channel.id === '941944931382075422' || message.channel.id === '941944985211772978' || message.channel.id === '941943218721923072' || message.channel.id === '941943402482782218' || message.channel.id === '941943477258842122')) {
            var getAbbRefer = fs.readFileSync('./commands/abbs.json');
            var getAbbData = JSON.parse(getAbbRefer);

            let control = 0;
            let division = '';
            getAbbData.values.forEach(data => {
                if (control === 0) {
                    if (data[2] === args[0].toUpperCase()) {
                        division = data[3];
                        control++;
                    }
                }
            });

            if (division != '') {
                var model;
                if (division === 'HEAVY WEIGHT')
                    model = require('./rosterSchemas/rosterSchemaHeavy');
                else if (division === 'FLIGHT')
                    model = require('./rosterSchemas/rosterSchemaFlight');
                else if (division === 'ELITE')
                    model = require('./rosterSchemas/rosterSchemaElite');
                else if (division === 'BLOCKAGE')
                    model = require('./rosterSchemas/rosterSchemaBlockage');
                else if (division === 'CHAMPIONS')
                    model = require('./rosterSchemas/rosterSchemaChampions');

                const rosterData = await model.find({ abb: args[0].toUpperCase() });

                var playerDetail = [];
                var townHalls = {
                    'th14': 0,
                    'th13': 0,
                    'th12': 0,
                    'th11': 0,
                    'less than 11': 0,
                }
                var uptoEnd = new Promise((resolve, reject) => {
                    rosterData[0].players.forEach(async data => {
                        let fetechedData = await getPlayerDetail(data[0]);
                        playerDetail.push([data[0], fetechedData.townHallLevel, fetechedData.name]);
                        if (fetechedData.townHallLevel === 14)
                            townHalls['th14']++;
                        else if (fetechedData.townHallLevel === 13)
                            townHalls['th13']++;
                        else if (fetechedData.townHallLevel === 12)
                            townHalls['th12']++;
                        else if (fetechedData.townHallLevel === 11)
                            townHalls['th11']++;
                        else if (fetechedData.townHallLevel < 11)
                            townHalls['less than 11']++;
                        if (rosterData[0].rosterSize === playerDetail.length) {
                            resolve(playerDetail);
                        }
                    })
                });
                uptoEnd.then(async (newData) => {
                    newData.sort(function (a, b) {
                        return b[1] - a[1];
                    })
                    let rs = '';

                    newData.forEach(data => {
                        if (!(data[0] === undefined)) {
                            rs += `${data[0].padEnd(12, ' ')} ${(data[1].toString()).padEnd(2, ' ')} ${data[2].padEnd(15, ' ')}\n`;
                        }
                    });
                    const embeds = [];
                    const embed = new Discord.MessageEmbed()
                        .setColor('#1980de')
                        .setThumbnail('https://media.discordapp.net/attachments/914077029912170577/914442650957008906/WCL_new.png?width=532&height=612')
                        .setAuthor('By WCL Technical')
                        .setTitle(`Roster for ${args[0].toUpperCase()}!`)
                        .setDescription("```" + `Player Tag   TH Player Name` + `\n\n` + rs.slice(0, 1984) + "```")
                        .setTimestamp()
                    embeds.push(embed);
                    if (rs.length > 1984) {
                        const embedagain = new Discord.MessageEmbed()
                            .setColor('#1980de')
                            .setThumbnail('https://media.discordapp.net/attachments/914077029912170577/914442650957008906/WCL_new.png?width=532&height=612')
                            .setAuthor('By WCL Technical')
                            .setTitle(`Roster for ${args[0].toUpperCase()}!`)
                            .setDescription("```" + `Player Tag   TH Player Name` + `\n\n` + rs.slice(1984, rs.length) + "```")
                            .setTimestamp()
                        embeds.push(embedagain);
                    }

                    if (embeds.length === 1) {
                        message.channel.send(embeds[0].addField(`**Roster Information**`, `<:townhall14:842730161718820885> | **${townHalls['th14']}**\n<:townhall13:766289069486506004> | **${townHalls['th13']}**\n<:townhall12:766289153766850562> | **${townHalls['th12']}**\n<:townhall11:766289216661356564> | **${townHalls['th11']}**\n**Less than** <:townhall11:766289216661356564> | **${townHalls['less than 11']}**\n**Total Accounts** | **${rosterData[0].rosterSize}**\n**Addition Left** | **${rosterData[0].additionStatusLimit}**`).setFooter(`Page 1/1`));
                    }
                    else {
                        let m1 = 0;
                        embeds.map(function (r) { m1++; return r.addField(`**Roster Information**`, `<:townhall14:842730161718820885> | **${townHalls['th14']}**\n<:townhall13:766289069486506004> | **${townHalls['th13']}**\n<:townhall12:766289153766850562> | **${townHalls['th12']}**\n<:townhall11:766289216661356564> | **${townHalls['th11']}**\n**Less than** <:townhall11:766289216661356564> | **${townHalls['less than 11']}**\n**Total Accounts** | **${rosterData[0].rosterSize}**\n**Addition Left** | **${rosterData[0].additionStatusLimit}**`).setFooter(`Page ${m1}/2`) })
                        const Embeds = new paginationembed.Embeds()
                            .setArray(embeds)
                            .setTimeout(300000)
                            .setChannel(message.channel)
                            .setDisabledNavigationEmojis(['all'])
                            .setDisabledNavigationEmojis(['back', 'forward', 'jump'])
                            .setFunctionEmojis({
                                '◀️': (_, instance) => {
                                    instance.setPage('back');
                                },
                                '▶️': (_, instance) => {
                                    instance.setPage('forward');
                                },
                            })

                        await Embeds.build();
                    }
                });
            }
            else {
                message.reply(`Clan abb **${args[0].toUpperCase()}** is invalid`);
            }
        } else {
            message.reply(`You can't use this command here!`);
        }
    }
}