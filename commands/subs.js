const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment-timezone');

module.exports = {
    name: 'substitute',
    aliases: ["subs"],
    description: 'Allows you to take a subtitute!',
    args: true,
    length: 3,
    category: "representative",
    usage: 'clan_abb player_tag mention/tag/ping-opponent_rep',
    missing: ['`clan_abb`, ', '`player_tag`, ', '`mention/tag/ping-opponent_rep`'],
    explanation: 'Ex : wcl subs INQ #PCV8JQR0V @RAJ\n\nwhere INQ - Clan Abb\n@RAJ - Opponent Rep Mention',
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        // if(message.channel.id === '842738445259898880' || message.channel.id === '842755824992124968') {
        if (message.author.id === '531548281793150987') {
            const options = {
                'json': true,
                'Accept': 'application/json',
                'method': 'get',
                'muteHttpExceptions': true
            };
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
            let ds = m[0] + " | " + comb1 + ":" + comb2 + ":" + ct3;

            message.channel.send(`Processing....Please wait, this may take a while ${message.author.username}.`)

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                let result = await find(args[0].toUpperCase());
                if (result === '') {
                    message.reply(`**${args[0].toUpperCase()}** is invalid Clan Abb!`);
                }
                if (result === 'CHAMPIONS') {
                    message.reply(`Subs aren't allowed for Champions(eSports) Division!`);
                }

                const perm = {
                    spreadsheetId: '1f-bBim9f8njQYj5PpWPrEWCz1_rOPSZGJN9Ca37FW_E',
                    range: args[0].toUpperCase() + '!H2:H3'
                };
                let perm_data = await gsapi.spreadsheets.values.get(perm);
                let perm_array = perm_data.data.values;

                let ban = await ban_check(args[1].toUpperCase());
                let dupper = await dupe(args[1].toUpperCase());
                let mentions = '';

                const p = await fetch('http://wclapi.tk/player/' + args[1].toUpperCase().slice(1), options);
                let final = '';
                if (p.status === 503) {
                    final += 'Substitution paused due to Maintenance Break!'
                    message.reply(final);
                }
                if (p.status === 500 || p.status === 404) {
                    final += 'Invalid Tag'
                    message.reply(`${args[1].toUpperCase()} is ${final}!`);
                }
                if (p.status === 200) {
                    const data = await p.json();
                    let th = data.TH;
                    let pname = data.name;
                    if (message.author.id === perm_array[0][0] || message.author.id === perm_array[1][0] || message.member.hasPermission('MANAGE_ROLES')) {
                        if (ban === '') {
                            if (!(parseInt(dupper, 10) === 2)) {
                                if (message.mentions.users.first()) {
                                    mentions = message.mentions.users.first();
                                    replace(ds, args[1].toUpperCase(), pname, th, message.author.username, mentions.username, mentions.id);
                                }
                                else {
                                    message.reply(`You didn't mentioned opponent rep for subs approval!`);
                                }
                            }
                            else {
                                message.reply(`${args[1].toUpperCase()} is already used twice as a substitute, so can't approve according to the rules of substitution!\nTry using an another account.`);
                            }
                        }
                        else {
                            message.reply(`${args[1].toUpperCase()} is banned in WCL!`);
                        }
                    }
                    else {
                        message.reply(`You're not the representative of **${args[0].toUpperCase()}**!`)
                    }
                }

                async function find(abb) {
                    const ff = {
                        spreadsheetId: '1f-bBim9f8njQYj5PpWPrEWCz1_rOPSZGJN9Ca37FW_E',
                        range: 'ABBS!A2:C'
                    };
                    let ff_data = await gsapi.spreadsheets.values.get(ff);
                    let ff_array = ff_data.data.values;

                    let found = '';
                    ff_array.forEach(data => {
                        if (data[0] === abb) {
                            found += data[2];
                        }
                    });
                    return found;
                }

                async function ban_check(tag) {
                    const ban = {
                        spreadsheetId: '1qckELKFEYecbyGeDqRqItjSKm02ADpKfhkK1FiRbQ-c',
                        range: 'Banned Players!C6:C'
                    };
                    let data = await gsapi.spreadsheets.values.get(ban);
                    let data_array = data.data.values;
                    let found = '';
                    data_array.forEach(data => {
                        if (data[0] === tag) {
                            found += 'Found a ban!';
                        }
                    });
                    return found;
                }

                async function dupe(tag) {
                    const check = {
                        spreadsheetId: '1f-bBim9f8njQYj5PpWPrEWCz1_rOPSZGJN9Ca37FW_E',
                        range: args[0].toUpperCase() + '!B:B'
                    };
                    let check_data = await gsapi.spreadsheets.values.get(check);
                    let check_array = check_data.data.values;
                    let duplicate = 0;
                    check_array.forEach(data => {
                        if (data[0] === tag) {
                            duplicate += 1;
                        }
                    });
                    return duplicate;
                }

                async function replace(date, tag, name, th, usern, opp, oppid) {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#99a9d1')
                        .setAuthor('By WCL Technical')
                        .setTitle(`Substitution Preview of ${args[0].toUpperCase()}`)
                        .setDescription(`Please wait ${message.author} for sometime until <@${oppid}> doesn't approve your request!`)
                        .setThumbnail(`https://coc.guide/static/imgs/other/town-hall-${th}.png`)
                        .addField('Player Tag', tag, true)
                        .addField('Player Name', name, true)
                        .setTimestamp()
                        .setFooter(`Opponent is requested to react within an hour!`)
                    let collect = await message.channel.send(embed);
                    await collect.react('✅');
                    await collect.react('❎');
                    const filter = (reaction, user) => {
                        return ['✅', '❎'].includes(reaction.emoji.name) && user.id === oppid;
                    };
                    collector = await collect.createReactionCollector(filter, {
                        max: 1,
                        time: 3600000,
                        errors: ['time']
                    });
                    if (!(collector))
                        await collect.delete();
                    collector.on('collect', async (reaction, user) => {
                        if (reaction.emoji.name === '✅') {
                            put(date, tag, name, usern, opp, oppid);
                        }
                        else {
                            message.reply(`Substitution : ${tag} is rejected by <@${oppid}>!❎`);
                        }
                    });
                }

                async function put(date, tag, name, usern, opp, oppid) {
                    const subs = {
                        spreadsheetId: '1f-bBim9f8njQYj5PpWPrEWCz1_rOPSZGJN9Ca37FW_E',
                        range: args[0].toUpperCase() + '!G2:G'
                    };
                    let subs_data = await gsapi.spreadsheets.values.get(subs);
                    let subs_array = subs_data.data.values;
                    let control = 0;
                    let m1 = 0;
                    subs_array.forEach(data => {
                        m1 += 1;
                        if (data[0] === 'Yes' && control === 0) {
                            const substitute = {
                                spreadsheetId: '1f-bBim9f8njQYj5PpWPrEWCz1_rOPSZGJN9Ca37FW_E',
                                range: args[0].toUpperCase() + '!A' + (m1 + 1) + ':F',
                                valueInputOption: 'USER_ENTERED',
                                resource: { values: [[date, tag, name, usern, opp, oppid]] }
                            };
                            try {
                                gsapi.spreadsheets.values.update(substitute);
                                control++;
                                message.reply(`Substitution : ${tag} is accepted by **${opp}**!✅`)
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    });
                }
            }
        }
        else {
            message.reply(`Disabled command in this channel!`);
        }
    }
}