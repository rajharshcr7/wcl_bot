const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const fetch = require('node-fetch');

module.exports = {
    name: 'replaceeach',
    aliases: ['replaceeach'],
    description: 'replace_clan_details',
    args: true,
    length: 3,
    category: 'Admins',
    usage: 'new_clan_abb replace_prefix replacer',
    missing: ['`new_clan_abb`, ', '`replace_prefix`, ', '`replacer`'],
    explanation: 'Ex : wcl replaceeach cns CT clan_tag\n\nReplace_Prefix\nCT - Clan Tag\nCN - Clan Name\nSCT - Secondary Clan Tag\nCL - Clan Logo\nCRL - Clan Roster Link',
    execute: (message, args) => {
        // if(message.guild.id === '765523244332875776' || message.guild.id === '615297658860601403' || message.member.hasPermission('MANAGE_ROLES')) {
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
            const replacer = {
                'CN': '!B',
                'CT': '!C',
                'SCT': '!D',
                'CL': '!E',
                'CRL': '!F',
            };

            const replacing = {
                'CN': ':B',
                'CT': ':C',
                'SCT': ':D',
                'CL': ':E',
                'CRL': ':F',
            }

            if (replacer[args[1].toUpperCase()] === undefined) {
                message.reply(`Didn't found any replacer ${args[0].toUpperCase()}!`)
            }
            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                let find_new = await search(args[0].toUpperCase());
                if (find_new === 0) {
                    message.reply(`Clan **${args[0].toUpperCase()}** not found!`)
                }

                const rep = {
                    spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                    range: 'ALL DETAILS!A2:C'
                };
                let rep_data = await gsapi.spreadsheets.values.get(rep);
                let rep_array = rep_data.data.values;

                const rep1 = {
                    spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                    range: 'CLANS!F4:F'
                };
                let rep1_data = await gsapi.spreadsheets.values.get(rep1);
                let rep1_array = rep1_data.data.values;
                let fabb = 0;
                let fcontrol = 0;
                rep1_array.forEach(data => {
                    fabb += 1;
                    if (data[0] === args[0].toUpperCase() && fcontrol === 0) {
                        fcontrol = fabb;
                    }
                });
                let control = 0;
                let m1 = 0;
                let ct = '';
                let num = 0;
                if (args[1].toUpperCase() === 'CN') {
                    const p = await fetch(`http://wclapi.tk/clan/` + args[2].toUpperCase().slice(1), options);
                    if (p.status === 200) {
                        num = p.status;
                        const dt = await p.json();
                        ct += dt.name;
                    }
                }
                rep_array.forEach(data => {
                    m1 += 1;
                    if (data[0] === args[0].toUpperCase() && !(args[1].toUpperCase() === 'CN' || args[1].toUpperCase() === 'CL' || args[1].toUpperCase() === 'CRL') && control === 0) {
                        const put = {
                            spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                            range: 'ALL DETAILS' + replacer[args[1].toUpperCase()] + (m1 + 1) + replacing[args[1].toUpperCase()],
                            valueInputOption: 'USER_ENTERED',
                            resource: { values: [[args[2].toUpperCase()]] }
                        };
                        gsapi.spreadsheets.values.update(put);
                        message.reply(`Updated successfully **${args[0].toUpperCase()}** from ${data[2]} to ${args[2].toUpperCase()}! Ref - ${fcontrol + 3}`);
                        control++;
                    }
                    if (data[0] === args[0].toUpperCase() && (args[1].toUpperCase() === 'CN') && control === 0) {
                        if (num === 200) {
                            const put = {
                                spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                                range: 'ALL DETAILS' + replacer[args[1].toUpperCase()] + (m1 + 1) + replacing[args[1].toUpperCase()],
                                valueInputOption: 'USER_ENTERED',
                                resource: { values: [[ct]] }
                            };
                            gsapi.spreadsheets.values.update(put);
                            message.reply(`Updated successfully **${args[0].toUpperCase()}** with ${args[2].toUpperCase()} : ${ct}! Ref - ${fcontrol + 3}`)
                        }
                        else {
                            message.reply(`Invalid tag ${args[2].toUpperCase()}!`);
                        }
                        control++;
                    }
                    if (data[0] === args[0].toUpperCase() && (args[1].toUpperCase() === 'CL') && control === 0) {
                        const put = {
                            spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                            range: 'ALL DETAILS' + replacer[args[1].toUpperCase()] + (m1 + 1) + replacing[args[1].toUpperCase()],
                            valueInputOption: 'USER_ENTERED',
                            resource: { values: [[args[2]]] }
                        };
                        gsapi.spreadsheets.values.update(put);
                        message.reply(`Updated successfully **${args[0].toUpperCase()}** with ${args[2]}! Ref - ${fcontrol + 3}`);
                        control++;
                    }
                    if (data[0] === args[0].toUpperCase() && (args[1].toUpperCase() === 'CRL') && control === 0) {
                        const put = {
                            spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                            range: 'ALL DETAILS' + replacer[args[1].toUpperCase()] + (m1 + 1) + replacing[args[1].toUpperCase()],
                            valueInputOption: 'USER_ENTERED',
                            resource: { values: [[args[2]]] }
                        };
                        gsapi.spreadsheets.values.update(put);
                        message.reply(`Updated successfully **${args[0].toUpperCase()}** with ${args[2]}! Ref - ${fcontrol + 3}`);
                        control++;
                    }
                });

                async function search(abb) {
                    const find = {
                        spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                        range: 'ALL DETAILS!A2:A'
                    };
                    let find_data = await gsapi.spreadsheets.values.get(find);
                    let find_array = find_data.data.values;
                    let confirm = 0;
                    find_array.forEach(data => {
                        if (data[0] === abb) {
                            confirm += 1;
                        }
                    });
                    return confirm;
                }
            }
        }
        else {
            message.reply(`Can't use in **${message.guild.name}**!\nOR\nNOT AUTHORIZED!`);
        }
    }
}