const fetch = require('node-fetch');
const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const Discord = require('discord.js');
const PaginationEmbed = require('discord-paginationembed');

module.exports = {
    name: 'confirm',
    aliases: ["cfrm"],
    description: 'Stores the information of a clan!',
    args: true,
    length: 1,
    category: "moderator",
    missing: ['`identifier` '],
    usage: 'identifier',
    explanation: 'Ex: wcl cfrm identifier\nwhere identifier is to pick up clan details',
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        // if(message.member.hasPermission("MANAGE_ROLES")) {
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

            const div_identifier = {
                'BLIZZARD (6/4/10/5) No Dip': '#ffcd0b',
                'PIRATES (5/0/0/0) TH14 Only': '#93ad22'
            };

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });
                //from here

                let required = [];
                let sct = '';
                let logo = '';
                let cr = '';
                const cfetch = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1brVi-WOhMRjPdJy2EGXcnkjJ6PkhlNTtPzMn6Q7DWIY/values/Data!A2:AD?majorDimension=ROWS&key=YOURAPIKEY`, options);
                if (cfetch.status === 200) {
                    const clan_data = await cfetch.json();
                    clan_data.values.forEach(data => {
                        if (data[6] === '') {
                            sct = 'None';
                        }
                        else {
                            sct = data[6];
                        }
                        if (data[23] === '') {
                            logo = 'None';
                        }
                        else {
                            logo = data[23];
                        }
                        if (data[28] === '') {
                            cr = 'None';
                        }
                        else {
                            cr = data[28];
                        }
                        required.push([data[29], data[3], data[4], sct, logo, cr, data[2], data[16]]);
                    });

                    required.forEach(data => {
                        if (args[0].toUpperCase() === data[0]) {
                            send(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]);
                        }
                    })
                }
                //to here

                async function send(ref, cname, ctag, sct, logo, cr, tname, div) {
                    const cfetch = await fetch(`http://wclapi.tk/clan/${ctag.slice(1)}`, options);
                    if (cfetch.status === 200) {
                        const clan_data = await cfetch.json();
                        const embed = [];
                        const embed_confirm = new Discord.MessageEmbed()
                            .setColor(div_identifier[div])
                            .setAuthor('By Technical')
                            .setTitle(`Reference no. ${ref}`)
                            .setThumbnail(clan_data.badgeUrls.small)
                            .addFields(
                                { name: 'Team Name', value: tname, inline: false },
                                { name: 'Event Clan Name', value: clan_data.name, inline: false },
                                { name: 'Event Clan Tag', value: ctag, inline: false },
                                { name: 'Secondary Clan Tag', value: sct, inline: false },
                                { name: 'Clan Logo', value: '<' + logo + '>', inline: false },
                                { name: 'Clan Roster Link', value: '<' + cr + '>', inline: false },
                                { name: 'Division', value: div, inline: false },
                            )
                            .setFooter(`Time limit : 60s`)
                            .setTimestamp();
                        embed.push(embed_confirm);
                        if (message.member.hasPermission("MANAGE_ROLES")) {
                            const Embeds = new PaginationEmbed.Embeds()
                                .setArray(embed)
                                .setAuthorizedUsers([message.author.id])
                                .setChannel(message.channel)
                                .setTimeout(60000)
                                .setDisabledNavigationEmojis(['all'])
                                .setFunctionEmojis({
                                    '✅': async (_, instance) => {
                                        let result = await put(clan_data.name, ctag.toUpperCase(), sct.toUpperCase(), logo, cr, tname, div);
                                        instance.addField(`Status`, `Pre_Abb : **` + result + `**`);
                                        instance.resetEmojis();
                                    },
                                    '❎': (_, instance) => {
                                        instance.addField(`Rejected By`, `<@${message.author.id}>`);
                                        instance.resetEmojis();
                                    }
                                });
                            await Embeds.build();
                        }
                        else {
                            message.channel.send(`You don't have permission to use this command!`);
                        }
                    }
                    else {
                        message.reply(`The clan tag : **${ctag}** is invalid for **${cname}**(**${div}**)!`);
                    }
                }

                async function put(cname, ctag, sct, logo, cr, tname, div) {

                    const rfetch = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM/values/ALL DETAILS!A2:O?majorDimension=ROWS&key=YOURAPIKEY`, options);
                    let collect;
                    if (rfetch.status === 200) {
                        const r_data = await rfetch.json();
                        collect = r_data.values;
                        collect.forEach(data => {
                            collect.map(function (r) {
                                while (r.length < 15) {
                                    r.push('-');
                                }
                            });
                        });
                        let a = 0, m = 0;
                        let pre_abb = 'Failed';
                        let check = 0;
                        collect.forEach(data => {
                            if (data[2] === ctag && data[14] === div) {
                                check++;
                            }
                        });
                        if (check === 0) {
                            collect.forEach(data => {
                                m += 1;
                                if (data[2] === '' && a === 0) {
                                    const write_first = {
                                        spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                                        range: 'ALL DETAILS!' + 'B' + (m + 1) + ':F' + (m + 1),
                                        valueInputOption: 'USER_ENTERED',
                                        resource: { values: [[cname, ctag.trim(), sct.trim(), logo, cr]] }
                                    };
                                    try {
                                        gsapi.spreadsheets.values.update(write_first);
                                    } catch (err) {
                                        console.log(err);
                                    }
                                    const write_last = {
                                        spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                                        range: 'ALL DETAILS!' + 'N' + (m + 1) + ':O' + (m + 1),
                                        valueInputOption: 'USER_ENTERED',
                                        resource: { values: [[tname, div]] }
                                    };
                                    try {
                                        gsapi.spreadsheets.values.update(write_last);
                                    } catch (err) {
                                        console.log(err);
                                    }
                                    pre_abb = data[0];
                                    a++;
                                }
                            });
                        }
                        else {
                            pre_abb = `The clan tag already exists in the representative sheet!!\nFailed`;
                        }
                        return pre_abb;
                    }
                    else {
                        return 'An error occured';
                    }
                }
            }
        }
        else {
            message.reply(`You don't have permission to use this command!`);
        }
    }
}