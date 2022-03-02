const fetch = require('node-fetch');
const Discord = require('discord.js');
const moment = require('moment-timezone');
const PaginationEmbed = require('discord-paginationembed');
const fs = require('fs');

module.exports = {
    name: 'rosteradd',
    aliases: ['add'],
    description: 'Allows you to add a player to the WCL Roster',
    args: true,
    length: 2,
    cooldown: 20, //50 previous
    category: 'representative',
    missing: ['`clan_abb`, ', '`player_tag`, ', '`discord_id(optional)`'],
    usage: 'clan_abb player_tag discord_id(optional)',
    explanation: 'Ex: wcl add INQ #XYZ DISCORD_ID\n\nwhere\nINQ is clan abb\n#XYZ is ClashOfClans PlayerTag and\nDISCORD_ID is long number ID of the player\n-F(forceAdd optional for league admins only)',
    execute: async (message, args) => {
        if (message.channel.id === '941944848771080192' || message.channel.id === '941943402482782218' || message.channel.id === '847483626400907325' || message.channel.id === '766307563393515551') {
            const options = {
                'json': true,
                'Accept': 'application/json',
                'method': 'get',
                'muteHttpExceptions': true
            };
            const few = new Date();
            let msg = moment(few, 'EST').format();
            let m = msg.split('T');
            let n = m[1].split('+');
            let ct = n[0].split(':');
            let cte = n[1].split(':');
            let ct1 = parseInt(ct[0], 10); //22
            let ct2 = parseInt(ct[1], 10); //55
            let ct3 = parseInt(ct[2], 10); //60
            let tz1 = parseInt(cte[0], 10);
            let tz2 = parseInt(cte[1], 10);
            var comb1 = 0;
            var comb2 = 0;
            if ((ct1 + tz1) > 24) {
                ct1 = 24 - ct1; //2
                tz1 = tz1 - ct1; //3
                comb1 += tz1;
            }
            else {
                comb1 = ct1 + tz1;
            }
            if ((ct2 + tz2) > 60) {
                ct2 = 60 - ct2;
                tz2 = tz2 - ct2;
                comb2 += tz2;
            }
            else {
                comb2 = ct2 + tz2;
            }
            let dateNtime = m[0] + " | " + comb1 + ":" + comb2 + ":" + ct3;
            let dcid = ''
            if (args[2] === undefined) {
                dcid += '';
            }
            else {
                dcid += args[2].toUpperCase();
            }
            message.channel.send(`Processing....Please wait, this may take a while ${message.author.username}.`)

            //cos history checking
            const dt = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1qckELKFEYecbyGeDqRqItjSKm02ADpKfhkK1FiRbQ-c/values/Banned Clans!C6:C?majorDimension=ROWS&key=YOURAPIKEY`, options);
            const dt_array = await dt.json();
            const data = await fetch(`https://api.clashofstats.com/players/${args[1].slice(1)}/history/clans/`, options);
            if (data.status === 403) {
                message.reply(`**${args[1].toUpperCase()}** Clash Of Stats history is private, so couldn't process transaction!`);
                return;
            }
            else if (data.status === 404) {
                message.reply(`**${args[1].toUpperCase()}** tag is invalid!`);
                return;
            }
            const load = await data.json();
            const ar = [];
            for (const ld of load.log) {
                if (ld.tag === undefined || ld.tag === '') {
                    continue;
                }
                else if (!(ld.start === undefined) && !(ld.end === undefined) && !(ld.start === '') && !(ld.end === '')) {
                    let differentDays = Math.ceil(ld.duration / (1000 * 3600 * 24));
                    let date = ld.start.split('T');
                    ar.push([ld.tag, date[0], differentDays]);
                }
            }

            const today = new Date();
            let format = moment().format('YYYY-MM-DD', today);
            let formated = format.split('-');
            let a = 0;
            let found = '';
            async function pull(data1, data2, data3) {
                const dt = await fetch(`https://api.clashofstats.com/clans/${data1.slice(1)}`, options); //http://wclapi.tk/clan/
                const result = await dt.json();
                return `Visited banned clan : **${data1}** : **${result.name}** on ${data2} for ${data3} days.`;
            };
            dt_array.values.forEach(data => {
                if (!(data[0] === undefined)) {
                    ar.forEach(async data1 => {
                        if (data[0] === data1[0] && a === 0) {
                            const format = data1[1].split('-');
                            if (formated[0] === format[0]) {
                                if (((parseInt(formated[1], 10) - 4) <= parseInt(format[1], 10)) && (data1[2] > 2) && a === 0) {
                                    if ((parseInt(formated[1], 10) - 4) < (parseInt(format[1], 10)) && a === 0) {
                                        found += await pull(data1[0], data1[1], data1[2]);
                                        a += 1;
                                    }
                                    else if ((parseInt(formated[1], 10) - 4) === (parseInt(format[1], 10)) && parseInt(format[2], 10) >= parseInt(formated[2], 10) && a === 0) {
                                        found += await pull(data1[0], data1[1], data1[2]);
                                        a += 1;
                                    }
                                }
                            }
                            else {
                                if ((((parseInt(formated[1], 10) + 12) - parseInt(format[1], 10)) <= 4) && (data1[2] > 2) && a === 0) {
                                    if (((parseInt(formated[1], 10) + 12) - parseInt(format[1], 10)) < 4 && a === 0) {
                                        found += await pull(data1[0], data1[1], data1[2]);
                                        a += 1;
                                    }
                                    else if (((parseInt(formated[1], 10) + 12) - parseInt(format[1], 10)) === 4 && parseInt(format[2], 10) >= parseInt(formated[2], 10) && a === 0) {
                                        found += await pull(data1[0], data1[1], data1[2]);
                                        a += 1;
                                    }
                                }
                            }
                        }
                    });
                }
            });
            //cos history checking ended

            //abb checking
            var rawABBS = fs.readFileSync('./commands/abbs.json')
            var check_array = JSON.parse(rawABBS);
            let division = '';
            check_array.values.forEach(data => {
                if (data[2] === args[0].toUpperCase()) {
                    division = data[3];
                }
            });
            if (division === '') {
                message.reply(`${args[0].toUpperCase()} is invalid clan abb!`);
                return;
            }
            //abb checking ended

            var rosterData = await sendBack(division, args[0].toUpperCase(), []);

            let perm = [];
            if (rosterData.rosterReps[0].length === 1) {
                perm.push(rosterData.rosterReps[0][0])
            }
            else {
                perm.push(rosterData.rosterReps[0][0], rosterData.rosterReps[0][1])
            }
            // let t = id_data[1][0];
            // let r = id_data[2][0];

            const p = await fetch('https://api.clashofstats.com/players/' + args[1].toUpperCase().slice(1), options); //http://wclapi.tk/player/
            let final = '';
            if (p.status === 503) {
                final += 'Addition paused due to Maintenance Break!'
                message.reply(final);
                return;
            }
            let getbans = await ban_check(args[1].toUpperCase());
            let dupecheck = await dupe(args[1].toUpperCase(), rosterData.players);

            if (getbans === '') {
                if (dupecheck === '') {
                    const data = await p.json();
                    let th = '';
                    if (p.status === 200) {
                        final += data.name;
                        th += data.townHallLevel;
                        if (found === '') {
                            if (perm.includes(message.author.id) || message.author.id === '531548281793150987' || message.author.id === '602935588018061453') {
                                if (rosterData.additionStatus === 'Yes') {
                                    if (rosterData.additionSpot === 'Yes') {
                                        update(dateNtime, args[1].toUpperCase(), final, message.author.id, th, dcid);
                                    }
                                    else {
                                        message.reply(`Roster is full for ${args[0].toUpperCase()}!\nTry removing some accounts first.`);
                                        return;
                                    }
                                }
                                else {
                                    message.reply(`No addition spot left in ${args[0].toUpperCase()}!`);
                                    return;
                                }
                            }
                            else {
                                message.reply(`You're not authorized roster rep for ${args[0].toUpperCase()}!`);
                                return;
                            }
                        }
                        else {
                            message.reply(`The account **${args[1].toUpperCase()}** : **${final}** couldn't be added. Please check DM!`);
                            message.author.send(`Player ${final} - (${args[1].toUpperCase()})\n` + found);
                            return;
                        }
                    }
                }
                else {
                    message.reply(`${args[1].toUpperCase()} already exist in ${args[0].toUpperCase()}!`);
                    return;
                }
            }
            else {
                message.reply(`${args[1].toUpperCase()} is banned!`);
                return;
            }

            async function ban_check(tag) {
                const ban = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1qckELKFEYecbyGeDqRqItjSKm02ADpKfhkK1FiRbQ-c/values/Banned Players!C6:C?majorDimension=ROWS&key=YOURAPIKEY`, options)
                let data = await ban.json();
                let data_array = data.values;
                let found = '';
                data_array.forEach(data => {
                    if (data[0] === tag) {
                        found += 'Found a ban!';
                    }
                });
                return found;
            }

            async function dupe(tag, values) {
                let found = '';
                values.forEach(data => {
                    if (data[0] === tag.toUpperCase()) {
                        found += 'Found a dupe!';
                    }
                });
                return found;
            }

            async function update(date, tag, name, auth_id, th, dc_id) {
                const embed = [];
                const embedadd = new Discord.MessageEmbed()
                    .setColor('#128682')
                    .setAuthor('By WCL TECHNICAL')
                    .setTitle(`Addition Preview of ${args[0].toUpperCase()}`)
                    .setDescription(`React with ✅ or ❎ to approve/disapprove the addition!\n✅ - Addition Accepted\n❎ - Addition Rejected`)
                    .addField('Player Name', name, true)
                    .addField('Player Tag', tag, true)
                    .setThumbnail(`https://coc.guide/static/imgs/other/town-hall-${th}.png`) //townhall emoji fetch
                    .setFooter(`Requested by ${auth_id} | React within 60s`)
                    .setTimestamp()
                embed.push(embedadd);

                const Embeds = new PaginationEmbed.Embeds()
                    .setArray(embed)
                    .setAuthorizedUsers([message.author.id])
                    .setChannel(message.channel)
                    .setTimeout(60000)
                    .setDisabledNavigationEmojis(['all'])
                    .setFunctionEmojis({
                        '✅': (_, instance) => {
                            sendBack(division, args[0].toUpperCase(), [date, tag, name, auth_id, dc_id]);
                            instance.addField(`Added By`, `<@${message.author.id}>`);
                            instance.setColor('#0d9e12');
                            instance.resetEmojis();
                        },
                        '❎': (_, instance) => {
                            instance.addField(`Rejected By`, `<@${message.author.id}>`);
                            instance.setColor('#ff0000');
                            instance.resetEmojis();
                        }
                    });
                await Embeds.build();
            }

        }
        else {
            message.reply(`Not authorised for the command to be used in this channel!`);
        }

        async function sendBack(div, abb, dataArray) {
            var options = {
                'HEAVY WEIGHT': ['heavy', 'rosterSchemaHeavy'],
                'FLIGHT': ['flight', 'rosterSchemaFlight'],
                'ELITE': ['elite', 'rosterSchemaElite'],
                'BLOCKAGE': ['blockage', 'rosterSchemaBlockage'],
                'CHAMPIONS': ['champions', 'rosterSchemaChampions']
            };

            var rSize = {
                'HEAVY WEIGHT': [80, 32],
                'FLIGHT': [60, 24],
                'ELITE': [50, 20],
                'BLOCKAGE': [40, 16],
                'CHAMPIONS': [8, 3]
            };

            var rosterSchema = require('./rosterSchemas/' + options[div][1])

            var getData = await rosterSchema.find({ abb: abb });

            if (dataArray.length === 0) {
                return getData[0];
            }
            else {
                var rosterSize = getData[0].rosterSize + 1;
                var additionSpot = getData[0].additionSpot;
                var additionStatus = getData[0].additionStatus;
                var additionStatusLimit = getData[0].additionStatusLimit - 1;

                if (rosterSize >= rSize[div][0]) {
                    additionSpot = 'No'
                }
                if (additionStatusLimit <= 0) {
                    additionStatus = 'No'
                }

                if ((args.includes('-F') || args.includes('-f')) && message.member.hasPermission('MANAGE_ROLES')) {
                    getData[0].rosterSize = rosterSize;
                    getData[0].additionSpot = additionSpot;
                } else {
                    getData[0].rosterSize = rosterSize;
                    getData[0].additionSpot = additionSpot;
                    getData[0].additionStatus = additionStatus;
                    getData[0].additionStatusLimit = additionStatusLimit;

                }
                if (getData[0].additionRecord[0][0] === 'N/A') {
                    const deleteRecordNA = await rosterSchema.findOneAndUpdate(
                        { abb: abb },
                        {
                            $pull: {
                                'additionRecord': ['N/A', 'N/A', 'N/A', 'N/A']
                            }
                        }
                    );
                }
                getData[0].additionRecord.push([dataArray[0], dataArray[1], dataArray[2], dataArray[3]]);

                const updateTag = await rosterSchema.findOneAndUpdate(
                    { abb: abb },
                    {
                        $push: {
                            'players': [dataArray[1], dataArray[4]]
                        }
                    }
                );

                await getData[0].save()
                    .then((data) => console.log(data))
                    .catch((err) => console.log(err.message));
            }
        }
    }
}