const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const Discord = require('discord.js');

module.exports = {
    name: 'schedule',
    aliases: ["sch"],
    description: 'Schedules official match of WCL!',
    args: true,
    length: 8,
    category: "moderator",
    missing: ['`div-prefix`, ', '`wk-no`, ', '`abb1`, ', '`abb2`, ', '`date`, ', '`time`, ', '`duration`, ', '`opponent-mention`'],
    usage: 'div-prefix wk-no abb1 abb2 date time duration opponent-mention',
    explanation: `Ex : wcl sch b wk1 INQ VI 12.01.2021 13:30 16/24 @RAJ\n\nDivision Prefix\nB - Blizzard\nP - Pirates\n\nDate formats\ndd/mm/yyyy\ndd-mm-yyyy\ndd.mm.yyyy\n\nTime Zone Format\nEST(HH:MM)\n\nProcedure
Step 1 : Division Prefix
Step 2 : WeekNo like wk1, wk2
Step 3 : Clan Abb 1
Step 4 : Clan Abb 2
Step 5 : Date
Step 6 : Time
Step 7 : Prep/Battle
Step 8 : Tag your opponent rep
Note - The steps must be in above order in single line, no line break!`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        // if(message.channel.id === '842739523384901663' || message.channel.id === '766307530598252574' || message.channel.id === '389867900539895808' || message.channel.id === '727785953623670825') {
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

            const division = {
                /*'H' : 'HEAVY WEIGHT',
                'F' : 'FLIGHT',
                'E' : 'ELITE',
                'B' : 'BLOCKAGE',
                'C' : 'CHAMPIONS',*/
                'P': 'PIRATES',
                'B': 'BLIZZARD'
            };

            const hex = {
                /*'H' : '#01fbfe',
                'F' : '#3d45a2',
                'E' : '#e217e7',
                'B' : '#c50302',
                'C' : '#ffef04',*/
                'P': '#93ad22',
                'B': '#ffcd0b'
            };

            const week = {
                'WK1': 'WK1',
                'WK2': 'WK2',
                'WK3': 'WK3',
                'WK4': 'WK4',
                'WK5': 'WK5',
                'WK6': 'WK6',
                'WK7': 'WK7',
                'WK8': 'WK8',
                'WK9': 'WK9',
                'WK10': 'WK10',
                'WK11': 'WK11',
                'R128': 'R128',
                'R64': 'R64',
                'R32': 'R32',
                'WC': 'WC',
                'QF': 'QF',
                'SF': 'SF',
                'F': 'F',
            };

            const logo = {
                'B': 'https://media.discordapp.net/attachments/766306826542514178/841324500024688660/Blizzard_Division.png?width=495&height=612',
                'P': 'https://media.discordapp.net/attachments/766306826542514178/841324525954138192/Pirates_Division.png'
            };

            //#434343
            if (division[args[0].toUpperCase()] === undefined) {
                return message.channel.send('Invalid division prefix!')
            }

            if (week[args[1].toUpperCase()] === undefined) {
                return message.channel.send('Invalid week prefix!')
            }

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                const pull = {
                    spreadsheetId: '1XYbVO9LQ-gGzspqdmsQeHHlJPECbt4EO_jqXpeLzLGU',
                    range: 'Schedules!A2:K'
                };
                let pull_data = await gsapi.spreadsheets.values.get(pull);
                let pull_array = pull_data.data.values;

                let arep = '';
                let orepn = '';
                let orep = '';
                for (var i = 0; i < pull_array.length; i++) {
                    if (pull_array[i][10] === 'Yes') {
                        if (!(args[8] === '')) {
                            orep = message.mentions.users.map(user => {
                                return user.id;
                            });
                            orepn = message.mentions.users.map(user => {
                                return user.username;
                            });
                        }
                        else {
                            orep += args[8];
                            orepn += args[8];
                        }
                        arep = message.author.id;
                        let string = refer(args[4]); //conversion of date to Day and date format
                        let c1 = await clan(args[2].toUpperCase());
                        let c2 = await clan(args[3].toUpperCase());

                        if (c1 === '') {
                            message.reply(`No clan exist with abb **${args[2].toUpperCase()}** in WCL!\nOR\n**${args[2].toUpperCase()}** didn't matched with the division **${division[args[0].toUpperCase()]}**!`)
                            break;
                        }
                        if (c2 === '') {
                            message.reply(`No clan exist with abb **${args[3].toUpperCase()}** in WCL!\nOR\n**${args[3].toUpperCase()}** didn't matched with the division **${division[args[0].toUpperCase()]}**!`)
                            break;
                        }
                        const embed1 = new Discord.MessageEmbed()
                            .setColor('#99a9d1')
                            .setAuthor('By WCL Technical')
                            .setTitle('Confirmation of Time Zone in EST for ' + pull_array[i][0])
                            .setDescription(`Does this time ${args[5].toUpperCase()} is in EST ?\n\n✅ - Yes\n❎ - No`)
                            .setFooter(`React within 60s`)
                            .setTimestamp()
                        let collect = await message.channel.send(embed1);
                        await collect.react('✅');
                        await collect.react('❎');
                        const filter = (reaction, user) => {
                            return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
                        };
                        collector = await collect.createReactionCollector(filter, {
                            max: 1,
                            time: 60000,
                            errors: ['time']
                        });
                        if (!(collector))
                            await collect.delete();
                        collector.on('collect', async (reaction, user) => {
                            if (reaction.emoji.name === '✅') {
                                const dalo = {
                                    spreadsheetId: '1XYbVO9LQ-gGzspqdmsQeHHlJPECbt4EO_jqXpeLzLGU',
                                    range: 'Schedules!B' + (i + 2) + ':J',
                                    valueInputOption: 'USER_ENTERED',
                                    resource: { values: [[division[args[0].toUpperCase()], week[args[1].toUpperCase()], c1, c2, string.toDateString(), args[5].toUpperCase(), args[6].toUpperCase(), arep, orep[0]]] }
                                };
                                try {
                                    gsapi.spreadsheets.values.update(dalo);
                                } catch (err) {
                                    console.log(err);
                                }
                                await collect.delete();
                                const embed = new Discord.MessageEmbed()
                                    .setColor(hex[args[0].toUpperCase()])
                                    .setTitle(`Scheduled/War ID : ${pull_array[i][0]}`)
                                    .setThumbnail(logo[args[0].toUpperCase()])
                                    .setAuthor('By WCL')
                                    .addField('Division', division[args[0].toUpperCase()], false)
                                    .addField('Week', args[1].toUpperCase(), false)
                                    .addField('Clan 1', c1, true)
                                    .addField('Clan 2', c2, false)
                                    .addField('Scheduled On', ':calendar: ' + string.toDateString(), true)
                                    .addField('Time(EST)', ':clock1: ' + args[5].toUpperCase(), false)
                                    .addField('Duration', ':timer: ' + args[6].toUpperCase(), false)
                                    .addField('Scheduled By', message.author.username, false)
                                    .addField('Agreed By', orepn[0], false)
                                    .setTimestamp()
                                    .setFooter('Agreed Time will be in EST Time Zone!')
                                message.channel.send(embed);
                            }
                            else {
                                message.channel.send(`Rejected by ${message.author}!`);
                            }
                        });
                        break;
                    }
                }
                async function clan(name) {
                    const cname = {
                        spreadsheetId: '1XYbVO9LQ-gGzspqdmsQeHHlJPECbt4EO_jqXpeLzLGU',
                        range: 'ABBS!A2:C'
                    };
                    let cname_data = await gsapi.spreadsheets.values.get(cname);
                    let cname_array = cname_data.data.values;
                    let object = '';
                    cname_array.forEach(data => {
                        if (data[0] === name && data[2] === division[args[0].toUpperCase()]) {
                            object += data[1];
                        }
                    });
                    return object;
                }
                function refer(date) {
                    if (!(date.indexOf("/") < 0)) {
                        let string = stringToDate(date, "dd/MM/yyyy", "/");
                        return string;
                    }
                    if (!(date.indexOf("-") < 0)) {
                        let string = stringToDate(date, "dd-MM-yyyy", "-");
                        return string;
                    }
                    if (!(date.indexOf(".") < 0)) {
                        let string = stringToDate(date, "dd.MM.yyyy", ".");
                        return string;
                    }
                }
                function stringToDate(_date, _format, _delimiter) {

                    var formatLowerCase = _format.toLowerCase();
                    var formatItems = formatLowerCase.split(_delimiter);
                    var dateItems = _date.split(_delimiter);
                    var monthIndex = formatItems.indexOf("mm");
                    var dayIndex = formatItems.indexOf("dd");
                    var yearIndex = formatItems.indexOf("yyyy");
                    var month = parseInt(dateItems[monthIndex]);
                    month -= 1;
                    var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
                    return formatedDate;
                }
            }
        }
        else {
            message.reply(`Disabled schedule command in this channel!`);
        }
    }
}