const PaginationEmbed = require('discord-paginationembed');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'abbs',
    aliases: ['abbs'],
    description: 'List all clan abbreviations',
    args: true,
    length: 1,
    category: "all",
    usage: 'divisionPrefix',
    missing: ['`divisionPrefix`'],
    explanation: 'Ex: wcl abbs H\nwhere H - Heavyweight division\n\nPrefix\nH - Heavy Weight\nF - Flight\nE - Elite\nB - Blockage\nC - Champions(Esports)',
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const options = {
            'H': 'HEAVY WEIGHT',
            'F': 'FLIGHT',
            'E': 'ELITE',
            'B': 'BLOCKAGE',
            'C': 'CHAMPIONS'
        }
        const color = {
            'H': '#008dff',
            'F': '#3f1f8b',
            'E': '#a40ae7',
            'B': '#fc3902',
            'C': '#ffb014',
        }
        const logo = {
            'H': 'https://media.discordapp.net/attachments/914077029912170577/914443975107153920/WCL_Heavy.png?width=539&height=612',
            'F': 'https://media.discordapp.net/attachments/914077029912170577/914442651992989736/WCL_Flight.png?width=530&height=612',
            'E': 'https://media.discordapp.net/attachments/914077029912170577/914442651690991616/WCL_ELITE.png?width=514&height=612',
            'B': 'https://media.discordapp.net/attachments/914077029912170577/914442652315963402/WCL_Blockage_.png?width=435&height=613',
            'C': 'https://media.discordapp.net/attachments/914077029912170577/914442651238039572/WCL_Champions.png?width=548&height=612',
        };
        if (!(message.channel.id === '941944701358047292' || message.channel.id === '941944848771080192' || message.channel.id === '941944931382075422' || message.channel.id === '941944985211772978' || message.channel.id === '941943218721923072' || message.channel.id === '941943402482782218' || message.channel.id === '941943477258842122')) {

            if (!options[args[0].toUpperCase()])
                return message.reply(`Incorrect division ${args[0].toUpperCase()}!`);

            var abbsObject = fs.readFileSync('./commands/abbs.json');
            var JSobject = JSON.parse(abbsObject);

            var ABBSarray = JSobject.values;

            var reqABBS = [];
            ABBSarray.forEach(data => {
                if (data[3] === options[args[0].toUpperCase()]) {
                    reqABBS.push([data[2], data[0], data[1]]);
                }
            });

            reqABBS.sort(function (a, b) {
                var nameA = a[2].toUpperCase();
                var nameB = b[2].toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                else if (nameA > nameB) {
                    return 1;
                }

                return 0;
            });

            let col = '';
            reqABBS.forEach(data => {
                if (!(data[0] === undefined)) {
                    col += `${data[0].padEnd(4, ' ')} ${data[1].padEnd(12, ' ')} ${data[2].padEnd(15, ' ')}\n`;
                }
            });

            const embeds = [];
            const embed = new Discord.MessageEmbed()
                .setColor(color[args[0].toUpperCase()])
                .setAuthor('By WCL Technical')
                .setThumbnail(logo[args[0].toUpperCase()])
                .setTitle(`Clan Abbreviations for ${options[args[0].toUpperCase()]}!`)
                .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(0, 1972) + "```")
                .setTimestamp()
            embeds.push(embed);
            if (col.length > 1972) {
                const embed1 = new Discord.MessageEmbed()
                    .setColor(color[args[0].toUpperCase()])
                    .setAuthor('By WCL Technical')
                    .setThumbnail(logo[args[0].toUpperCase()])
                    .setTitle(`Clan Abbreviations for ${options[args[0].toUpperCase()]}!`)
                    .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(1972, 3944) + "```")
                    .setTimestamp()
                embeds.push(embed1);
            }
            if (col.length > 3944) {
                const embed2 = new Discord.MessageEmbed()
                    .setColor(color[args[0].toUpperCase()])
                    .setAuthor('By WCL Technical')
                    .setThumbnail(logo[args[0].toUpperCase()])
                    .setTitle(`Clan Abbreviations for ${options[args[0].toUpperCase()]}!`)
                    .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(3944, 5916) + "```")
                    .setTimestamp()
                embeds.push(embed2);
            }
            if (col.length > 5916) {
                const embed3 = new Discord.MessageEmbed()
                    .setColor(color[args[0].toUpperCase()])
                    .setAuthor('By WCL Technical')
                    .setThumbnail(logo[args[0].toUpperCase()])
                    .setTitle(`Clan Abbreviations for ${options[args[0].toUpperCase()]}!`)
                    .setDescription("```" + `Abbs Clan Tag    Clan Name` + `\n\n` + col.slice(5916, col.length) + "```")
                    .setTimestamp()
                embeds.push(embed3);
            }

            if (embeds.length === 1) {
                message.channel.send(embeds[0].setFooter(`Page 1/1`));
            }
            else {
                let m1 = 0;
                embeds.map(function (r) { m1++; return r.setFooter(`Page ${m1}/${embeds.length}`) })
                const Embeds = new PaginationEmbed.Embeds()
                    .setArray(embeds)
                    .setTimeout(600000)
                    .setChannel(message.channel)
                    /* Sets the client's assets to utilise. Available options:
                     *  - message: the client's Message object (edits the message instead of sending new one for this instance)
                     *  - prompt: custom content for the message sent when prompted to jump to a page
                     *      {{user}} is the placeholder for the user mention
                     *.setClientAssets({ prompt: 'Enter the page number between 1-6, you want to jump on {{user}}' })
                     */
                    .setDeleteOnTimeout(false)
                    .setDisabledNavigationEmojis(['back', 'forward', 'jump', 'delete'])
                    .setFunctionEmojis({
                        /*'⏮️': (_,instance) => { //to be enabled during season 9
                            instance.setPage(1);
                        },*/
                        '◀️': (_, instance) => {
                            instance.setPage('back');
                        },
                        '▶️': (_, instance) => {
                            instance.setPage('forward');
                        },
                        /*'⏭️': (_,instance) => { //to be enabled during season 9
                            instance.setPage(4);
                        },*/
                        '🔄': (_, instance) => {
                            instance.resetEmojis();
                        }
                    })

                await Embeds.build();
            }
        }
        else {
            message.reply(`You can't use this command here!`);
        }
    }
}