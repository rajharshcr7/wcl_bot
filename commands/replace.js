//to change abb and clan tag
//updating clan abb changes take place in reps collection(matching through division), division-wise collection(matching through division), abbs collection(matching through division)
const fs = require('fs');
const fetch = require('node-fetch');
module.exports = {
    name: 'replace',
    aliases: ['replaceabb', 'replacetag'],
    description: 'Replace a clan_abb',
    args: true,
    length: 3,
    category: 'Admins',
    usage: 'type clanAbb detail',
    missing: ['`type`, ', '`clanAbb`, ', '`detail`'],
    explanation: 'Ex : wcl replace abb lon lp4\n\nWhile using abb\n@param2 and 3 are old and new clanAbb\nWhile using ct\n@param2 and 3 are clanAbb and new clanTag',
    execute: async (message, args) => {
        var ABBSobject = fs.readFileSync('./commands/abbs.json');
        var abbs = JSON.parse(ABBSobject);

        async function abbCheck(abb) {
            let division = '';
            abbs.values.forEach(data => {
                if (data[2] === abb) {
                    division = data[3];
                }
            });
            return division;
        }

        async function updateAbbsCollection(division) {
            try {
                const abbSchema = require(`./abbSchema/abbSchema`);
                if (args[0].toUpperCase() === 'ABB') {
                    const abbDataAdd = await abbSchema.findOneAndUpdate(
                        { div: division },
                        {
                            $addToSet: {
                                'values.$[element]': args[2].toUpperCase()
                            }
                        },
                        { arrayFilters: [{ element: args[1].toUpperCase() }] }
                    );
                    const abbDataRemove = await abbSchema.findOneAndUpdate(
                        { div: division },
                        {
                            $pull: {
                                'values.$[element]': args[1].toUpperCase()
                            },
                        },
                        { arrayFilters: [{ element: args[1].toUpperCase() }] }
                    );
                }
                else if (args[0].toUpperCase() === 'CT') {
                    const options = {
                        'json': true,
                        'Accept': 'application/json',
                        'method': 'get',
                        'muteHttpExceptions': true
                    };

                    const fetchClan = await fetch(`https://api.clashofstats.com/clans/${args[2].slice(1)}`, options);

                    if (fetchClan.status === 404) {
                        message.reply(`Clan ${args[2].toUpperCase()} not found!`);
                        return;
                    }
                    else if (fetchClan.status === 503) {
                        message.reply(`Replacing paused due to maintenance break!`);
                        return;
                    }
                    const clanData = await fetchClan.json();

                    const abbData = await abbSchema.find({ div: division });

                    var match;
                    var control = 0;
                    abbData[0].values.forEach(data => {
                        if (data[2] === args[1].toUpperCase() && control === 0) {
                            match = data;
                            control++;
                        }
                    });
                    if (match[0] === args[2].toUpperCase()) {
                        message.reply(`Clan tag *${args[2].toUpperCase()} : ${clanData.name}* already exists!`)
                        return 'Bad request';
                    }
                    const repDataAdd = await abbSchema.findOneAndUpdate(
                        { div: division },
                        {
                            $push: {
                                'values': [args[2].toUpperCase(), clanData.name, match[2]]
                            }
                        }
                    );
                    const repDataRemove = await abbSchema.findOneAndUpdate(
                        { div: division },
                        {
                            $pull: {
                                'values': match
                            },
                        }
                    );
                }
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }

        async function updateRepsCollection(division) {
            try {
                const repSchema = require('./repsSchema/repsSchema');

                const repData = await repSchema.find({ div: division });

                var match;
                var control = 0;
                repData[0].values.forEach(data => {
                    if (data[0] === args[1].toUpperCase() && control === 0) {
                        match = data;
                        control++;
                    }
                });
                const repDataAdd = await repSchema.findOneAndUpdate(
                    { div: division },
                    {
                        $push: {
                            'values': [args[2].toUpperCase(), match[1], match[2], match[3], match[4]]
                        }
                    }
                );
                const repDataRemove = await repSchema.findOneAndUpdate(
                    { div: division },
                    {
                        $pull: {
                            'values': match
                        }
                    }
                );
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }

        async function divRosterCollection(division) {
            try {
                var collectionFromDivision = {
                    'HEAVY WEIGHT': 'Heavy',
                    'FLIGHT': 'Flight',
                    'ELITE': 'Elite',
                    'BLOCKAGE': 'Blockage',
                    'CHAMPIONS': 'Champions'
                };

                if (args[0].toUpperCase() === 'ABB') {
                    var rosterSchema = require(`./rosterSchemas/rosterSchema${collectionFromDivision[division]}`);

                    var rosterData = await rosterSchema.find({ abb: args[1].toUpperCase() });

                    rosterData[0].abb = args[2].toUpperCase();
                    await rosterData[0].save().then((data) => console.log(data)).catch((err) => console.log(err.message));
                }
                else if (args[0].toUpperCase() === 'CT') {
                    var rosterSchema = require(`./rosterSchemas/rosterSchema${collectionFromDivision[division]}`);

                    var rosterData = await rosterSchema.find({ abb: args[1].toUpperCase() });

                    rosterData[0].clanTag = args[2].toUpperCase();
                    rosterData[0].save().then((data) => console.log(data)).catch((err) => console.log(err.message));
                }
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }

        if (message.guild.id === '765523244332875776' || message.guild.id === '615297658860601403' || message.member.hasPermission('MANAGE_ROLES')) {
            if (args[0].toUpperCase() === 'ABB') {//abb change
                let division = await abbCheck(args[1].toUpperCase());
                if (division === '') {
                    message.reply(`Invalid abb ${args[1].toUpperCase()}`);
                    return;
                }

                //Updating abbs collection
                await updateAbbsCollection(division);
                //Updating abbs collection ended

                //Updating reps collection
                if (args[0].toUpperCase() === 'ABB') {
                    await updateRepsCollection(division);
                }
                //Updating reps collection ended

                //Updating division-wise roster collection
                await divRosterCollection(division);
                //Updating division-wise roster collection ended

                await message.react('✅');
                message.reply(`Updated abb change from **${args[1].toUpperCase()}** to **${args[2].toUpperCase()}**\nPlease use ` + '`wcl updatedb` to successfully load database!').then((msg) => msg.react('✅'));
                return;
            }
            else if (args[0].toUpperCase() === 'CT') {//clan tag change
                let division = await abbCheck(args[1].toUpperCase());
                if (division === '') {
                    message.reply(`Invalid abb ${args[1].toUpperCase()}`);
                    return;
                }

                //Updating abbs collection
                var status = await updateAbbsCollection(division);
                //Updating abbs collection ended

                if (status === 'Bad request')
                    return;

                //Updating division-wise roster collection
                await divRosterCollection(division);
                //Updating division-wise roster collection ended

                await message.react('✅');
                message.reply(`Updated clanTag for **${args[1].toUpperCase()}** to **${args[2].toUpperCase()}**\nPlease use ` + '`wcl updatedb` to successfully load database!').then((msg) => msg.react('✅'));
                return;
            }
        }
        else {
            message.reply(`You can't use this command!`);
        }
    }
}