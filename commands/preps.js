//@params
//1 - clan abb
//2 - rep identifier
//3 - rep mention
const fs = require('fs');
module.exports = {
    name: 'changerep',
    aliases: ['creps', 'cr'],
    description: 'Stores the information of clan representative!',
    args: true,
    length: 2,
    category: "moderator",
    usage: 'clanAbb repPrefix repMention/clear',
    missing: ['`clanAbb`, ', '`repPrefix`, ', '`repMention/clear`'],
    explanation: `Ex: wcl creps INQ R1 @RAJ\nwhere Rep1 or R1 - RAJ\nOR\nwcl creps INQ all @RAJ @Candy\nwhere Rep1 - RAJ and Rep2 - Candy\n\nwcl creps clanAbb clear\nThis command clears the data of both representatives. Individuals can be cleared by r1/r2 accordingly.\n\n
Rep Prefix\nr1 - Representative 1\nr2 - Representative 2\nall - Both representatives`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        const roster = {
            'HEAVY WEIGHT': 'Heavy',
            'FLIGHT': 'Flight',
            'ELITE': 'Elite',
            'BLOCKAGE': 'Blockage',
            'CHAMPIONS': 'Champions'
        };
        async function checkAbb(abb) {
            var abbDataObject = fs.readFileSync('./commands/abbs.json');
            var abbData = JSON.parse(abbDataObject);
            var division = '';
            var control = 0
            abbData.values.forEach(data => {
                if (data[2] === abb && control === 0) {
                    division = data[3];
                    control++;
                }
            });
            return division;
        }
        if (message.guild.id === '765523244332875776' || message.guild.id === '615297658860601403' || message.member.hasPermission('MANAGE_ROLES')) {
            var abbCheck = await checkAbb(args[0].toUpperCase());
            if (abbCheck === '') {
                message.reply(`Invalid clan abb ${args[0].toUpperCase()}`);
                return;
            }
            if (args[1].toUpperCase() === 'R1') {
                callChangeFirstRep(abbCheck);
                return;
            }
            else if (args[1].toUpperCase() === 'R2') {
                callChangeSecondRep(abbCheck);
                return;
            }
            else if (args[1].toUpperCase() === 'ALL') {
                callChangeAllRep(abbCheck);
                return;
            }
            else if (args[1].toUpperCase() === 'CLEAR') {
                callClearRep(abbCheck);
                return;
            }
            else {
                message.reply(`Invalid indentifier ${args[1].toUpperCase()}!`);
                return;
            }
        } else {
            message.reply(`You can't use this command!`);
            return;
        }

        async function getRepInfo() {
            var rep_name = message.mentions.users.map(user => {
                return user.username;
            });
            var rep_id = message.mentions.users.map(user => {
                return user.id;
            });
            var rep_tag = message.mentions.users.map(user => {
                return user.discriminator;
            });
            return [rep_name, rep_id, rep_tag];
        }

        async function callChangeFirstRep(div) {
            try {
                var repInfo = await getRepInfo();
                var rosterSchema = require(`./rosterSchemas/rosterSchema${roster[div]}`);
                var repSchema = require('./repsSchema/repsSchema');

                var repData = await repSchema.find({ div: div });
                var collectRep;
                repData[0].values.forEach(data => {
                    if (data[0] === args[0].toUpperCase()) {
                        collectRep = data;
                    }
                });

                const addNewRep = await repSchema.findOneAndUpdate(
                    { div: div },
                    {
                        $push: {
                            'values': [args[0].toUpperCase(), repInfo[0][0] + "#" + repInfo[2][0], repInfo[1][0], collectRep[3], collectRep[4]]
                        }
                    }
                );

                const removeOldRep = await repSchema.findOneAndUpdate(
                    { div: div },
                    {
                        $pull: {
                            'values': collectRep
                        }
                    }
                );

                var oldRosterRep = await rosterSchema.find({ abb: args[0].toUpperCase() });
                var oldRepArr = oldRosterRep[0].rosterReps;
                const addNewRosterRep = await rosterSchema.findOneAndUpdate(
                    { abb: args[0].toUpperCase() },
                    {
                        $push: {
                            'rosterReps': [repInfo[1][0], collectRep[4]]
                        }
                    }
                );

                const removeOldRosterRep = await rosterSchema.findOneAndUpdate(
                    { abb: args[0].toUpperCase() },
                    {
                        $pull: {
                            'rosterReps': oldRepArr[0]
                        }
                    }
                );

                if (collectRep[1] === "" || collectRep[2] === "") {
                    await message.react('✅');
                    message.reply(`Updated rep change from **None** to **${repInfo[0][0] + "#" + repInfo[2][0]}**`).then((msg) => msg.react('✅'));
                    return;
                }

                await message.react('✅');
                message.reply(`Updated rep change from **${collectRep[1]}** to **${repInfo[0][0] + "#" + repInfo[2][0]}**`).then((msg) => msg.react('✅'));
                return;
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }

        async function callChangeSecondRep(div) {
            try {
                var repInfo = await getRepInfo();
                var rosterSchema = require(`./rosterSchemas/rosterSchema${roster[div]}`);
                var repSchema = require('./repsSchema/repsSchema');

                var repData = await repSchema.find({ div: div });
                var collectRep;
                repData[0].values.forEach(data => {
                    if (data[0] === args[0].toUpperCase()) {
                        collectRep = data;
                    }
                });
                if (collectRep[1] === "" || collectRep[2] === "") {
                    const addNewRep = await repSchema.findOneAndUpdate(
                        { div: div },
                        {
                            $push: {
                                'values': [args[0].toUpperCase(), repInfo[0][0] + "#" + repInfo[2][0], repInfo[1][0], collectRep[3], collectRep[4]]
                            }
                        }
                    );
                    var oldRosterRep = await rosterSchema.find({ abb: args[0].toUpperCase() });
                    var oldRepArr = oldRosterRep[0].rosterReps;
                    const addNewRosterRep = await rosterSchema.findOneAndUpdate(
                        { abb: args[0].toUpperCase() },
                        {
                            $push: {
                                'rosterReps': [repInfo[1][0], collectRep[4]]
                            }
                        }
                    );

                    const removeOldRosterRep = await rosterSchema.findOneAndUpdate(
                        { abb: args[0].toUpperCase() },
                        {
                            $pull: {
                                'rosterReps': oldRepArr[0]
                            }
                        }
                    );
                } else {
                    const addNewRep = await repSchema.findOneAndUpdate(
                        { div: div },
                        {
                            $push: {
                                'values': [args[0].toUpperCase(), collectRep[1], collectRep[2], repInfo[0][0] + "#" + repInfo[2][0], repInfo[1][0]]
                            }
                        }
                    );
                    var oldRosterRep = await rosterSchema.find({ abb: args[0].toUpperCase() });
                    var oldRepArr = oldRosterRep[0].rosterReps;
                    const addNewRosterRep = await rosterSchema.findOneAndUpdate(
                        { abb: args[0].toUpperCase() },
                        {
                            $push: {
                                'rosterReps': [collectRep[2], repInfo[1][0]]
                            }
                        }
                    );

                    const removeOldRosterRep = await rosterSchema.findOneAndUpdate(
                        { abb: args[0].toUpperCase() },
                        {
                            $pull: {
                                'rosterReps': oldRepArr[0]
                            }
                        }
                    );
                }

                const removeOldRep = await repSchema.findOneAndUpdate(
                    { div: div },
                    {
                        $pull: {
                            'values': collectRep
                        }
                    }
                );

                if (collectRep[1] === "" || collectRep[2] === "") {
                    await message.react('✅');
                    message.reply(`Updated rep change from **None** to **${repInfo[0][0] + "#" + repInfo[2][0]}**`).then((msg) => msg.react('✅'));
                    return;
                }
                else if (collectRep[3] === "" || collectRep[3] === "") {
                    await message.react('✅');
                    message.reply(`Updated rep change from **None** to **${repInfo[0][0] + "#" + repInfo[2][0]}**`).then((msg) => msg.react('✅'));
                    return;
                }
                await message.react('✅');
                message.reply(`Updated rep change from **${collectRep[3]}** to **${repInfo[0][0] + "#" + repInfo[2][0]}**`).then((msg) => msg.react('✅'));
                return;
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }

        async function callChangeAllRep(div) {
            try {
                var repInfo = await getRepInfo();
                var rosterSchema = require(`./rosterSchemas/rosterSchema${roster[div]}`);
                var repSchema = require('./repsSchema/repsSchema');

                var repData = await repSchema.find({ div: div });
                var collectRep;
                repData[0].values.forEach(data => {
                    if (data[0] === args[0].toUpperCase()) {
                        collectRep = data;
                    }
                });

                const addNewRep = await repSchema.findOneAndUpdate(
                    { div: div },
                    {
                        $push: {
                            'values': [args[0].toUpperCase(), repInfo[0][0] + "#" + repInfo[2][0], repInfo[1][0], repInfo[0][1] + "#" + repInfo[2][1], repInfo[1][1]]
                        }
                    }
                );

                const removeOldRep = await repSchema.findOneAndUpdate(
                    { div: div },
                    {
                        $pull: {
                            'values': collectRep
                        }
                    }
                );

                var oldRosterRep = await rosterSchema.find({ abb: args[0].toUpperCase() });
                var oldRepArr = oldRosterRep[0].rosterReps;
                const addNewRosterRep = await rosterSchema.findOneAndUpdate(
                    { abb: args[0].toUpperCase() },
                    {
                        $push: {
                            'rosterReps': [repInfo[1][0], repInfo[1][1]]
                        }
                    }
                );

                const removeOldRosterRep = await rosterSchema.findOneAndUpdate(
                    { abb: args[0].toUpperCase() },
                    {
                        $pull: {
                            'rosterReps': oldRepArr[0]
                        }
                    }
                );

                await message.react('✅');
                message.reply(`Updated rep change from **${collectRep[1]}** and **${collectRep[3]}** to **${repInfo[0][0] + "#" + repInfo[2][0]}** and **${repInfo[0][1] + "#" + repInfo[2][1]}**!`).then((msg) => msg.react('✅'));
                return;
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }

        async function callClearRep(div) {
            try {
                var repInfo = await getRepInfo();
                var repSchema = require('./repsSchema/repsSchema');

                var repData = await repSchema.find({ div: div });
                var collectRep;
                repData[0].values.forEach(data => {
                    if (data[0] === args[0].toUpperCase()) {
                        collectRep = data;
                    }
                });

                const addNewRep = await repSchema.findOneAndUpdate(
                    { div: div },
                    {
                        $push: {
                            'values': [args[0].toUpperCase(), "", "", "", ""]
                        }
                    }
                );

                const removeOldRep = await repSchema.findOneAndUpdate(
                    { div: div },
                    {
                        $pull: {
                            'values': collectRep
                        }
                    }
                );

                await message.react('✅');
                message.reply(`Removed reps **${collectRep[1]}** and **${collectRep[3]}**!`).then((msg) => msg.react('✅'));
                return;
            } catch (err) {
                message.reply(err.message);
                return;
            }
        }
    }
}