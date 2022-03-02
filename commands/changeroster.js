const fs = require('fs');
const fetch = require('node-fetch');
module.exports = {
    name: 'changeroster',
    aliases: ['crs'],
    args: true,
    length: 2,
    category: 'league admins',
    description : 'Helps changing roster for a new replacement',
    missing: ['`clanAbb`, ', '`rosterLink`'],
    usage: 'clanAbb rosterLink(gSheet link)',
    explanation: 'wcl crs XYZ https://docs.google.com/spreadsheets/d/..../',
    execute: async (message, args) => {
        const options = {
            'json': true,
            'Accept': 'application/json',
            'method': 'get',
            'muteHttpExceptions': true
        };
        if (message.guild.id === '765523244332875776' || message.guild.id === '615297658860601403' || message.member.hasPermission('MANAGE_ROLES')) {
            let division = await checkAbb(args[0].toUpperCase());
            if (division === '') {
                message.reply(`Invalid clan abb ${args[0].toUpperCase()}!`)
                return;
            }
            await changeRoster(division);
            return;
        } else {
            message.reply(`You can't use this command!`);
        }

        async function checkAbb(abb) {
            var abbObject = fs.readFileSync('./commands/abbs.json');
            var abbData = JSON.parse(abbObject);
            let division = '';
            abbData.values.forEach(data => {
                if (abb === data[2]) {
                    division = data[3];
                }
            });
            return division;
        }

        async function changeRoster(division) {
            const roster = {
                'HEAVY WEIGHT': ['Heavy', 32, 80],
                'FLIGHT': ['Flight', 24, 60],
                'ELITE': ['Elite', 20, 50],
                'BLOCKAGE': ['Blockage', 16, 40],
                'CHAMPIONS': ['Champions', 3, 8]
            };
            try {
                var rosterSchema = require(`./rosterSchemas/rosterSchema${roster[division][0]}`);
                const new_data = args[1].split('/');
                let data;
                let fresh = [];
                if (new_data.length === 1) {
                    data = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${new_data[0]}/values/ROSTER!B6:C?majorDimension=ROWS&key=YOURAPIKEY`, options);
                }
                else if (new_data.length > 1) {
                    data = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${new_data[5]}/values/ROSTER!B6:C?majorDimension=ROWS&key=YOURAPIKEY`, options);
                }
                else {
                    message.reply(`Improper format of sheet link!`);
                }
                if (data.status === 400) {
                    message.reply(`Invalid range or tab!`);
                }
                else if (data.status === 403) {
                    message.reply(`Sheet link or ID(<${args[1]}>) is private!`);
                }
                else if (data.status === 404) {
                    message.reply(`Sheet not found or it's in owner's trash!`);
                }
                else if (data.status === 200) {
                    const convert = await data.json();
                    if (convert.values[0].length > 1) {
                        convert.values.forEach(data => {
                            if (!(data[1] === undefined || data[1] === ' '))/*condition to eliminate blank values*/ {
                                fresh.push([(data[1].trim()).toUpperCase(), data[0]]);
                            }
                        });
                        if (fresh.length <= roster[division][2]) {
                            var rosterData = await rosterSchema.find({ abb: args[0].toUpperCase() });
                            var values = rosterData[0].players;
                            console.log(fresh, values);
                            if (fresh.length < roster[division][2]) {
                                rosterData[0].additionSpot = 'Yes';
                            }
                            else {
                                rosterData[0].additionSpot = 'No';
                            }
                            rosterData[0].rosterSize = fresh.length;
                            rosterData[0].players = fresh;
                            rosterData[0].additionStatusLimit = roster[division][1];
                            rosterData[0].additionStatus = 'Yes';
                            rosterData[0].additionRecord = [['N/A', 'N/A', 'N/A', 'N/A']];
                            rosterData[0].removalRecord = [['N/A', 'N/A', 'N/A', 'N/A']];
                            await rosterData[0].save().then((data) => console.log(data)).catch((err) => console.log(err.message));
                            await message.reply(`Succesfully changed roster!`).then((msg) => msg.react('✅'))
                        }
                        else {
                            message.reply(`Roster has extra player(s) than that of required as per division!!`);
                        }
                    } else {
                        message.reply("The import_range must have two column containing only #players_tags and DC_ID.");
                    }
                }
            } catch (err) {
                message.reply(err.message);
            }
        }
    }
}