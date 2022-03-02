const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const Discord = require('discord.js');

module.exports = {
    name: 'unschedule',
    aliases: ["unsch"],
    description: 'Unschedules the match',
    args: true,
    length: 1,
    category: "moderator",
    usage: 'War_ID',
    explanation: 'Ex : wcl unsch 1001\n\nwhere 1001 - War ID',
    missing: ['`War_ID`'],
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

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                const pull = {
                    spreadsheetId: '1XYbVO9LQ-gGzspqdmsQeHHlJPECbt4EO_jqXpeLzLGU',
                    range: 'Schedules!A2:K'
                };
                let pull_data = await gsapi.spreadsheets.values.get(pull);
                let pull_array = pull_data.data.values;

                let ff = await warid(parseInt(args[0].toUpperCase(), 10));
                if (ff === 0) {
                    message.reply(`Not found any War ID **${args[0].toUpperCase()}**!`)
                }

                for (var i = 0; i < pull_array.length; i++) {
                    if (pull_array[i][0] === args[0].toUpperCase() && (message.author.id === pull_array[i][8] || message.author.id === pull_array[i][9] || message.member.hasPermission('MANAGE_ROLES'))) {
                        const embed1 = new Discord.MessageEmbed()
                            .setColor('#99a9d1')
                            .setAuthor('By WCL Technical')
                            .setTitle('Unschedule for ' + pull_array[i][0])
                            .setDescription(`Do you want to unschedule the following match?\n\n${pull_array[i][2]} **${pull_array[i][3]}** vs **${pull_array[i][4]}**\n\n✅ - Yes\n❎ - No`)
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
                                    range: 'Schedules!B' + (i + 2) + ':J' + (i + 2)
                                };
                                try {
                                    gsapi.spreadsheets.values.clear(dalo);
                                    message.channel.send(`War **${args[0].toUpperCase()}** unscheduled!`)
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                            else {
                                message.channel.send(`Rejected by ${message.author}!`);
                            }
                        });
                        break;
                    }
                }
                let count = 0;
                pull_array.forEach(data => {
                    if (data[0] === args[0].toUpperCase() && count === 0) {
                        if (!(data[8] === message.author.id || data[9] === message.author.id || message.member.hasPermission('MANAGE_ROLES'))) {
                            message.reply(`Cannot unschedule **${args[0].toUpperCase()}** because you've not scheduled/agreed to this match!`);
                            count++;
                        }
                    }
                });

                async function warid(num) {
                    const cname = {
                        spreadsheetId: '1XYbVO9LQ-gGzspqdmsQeHHlJPECbt4EO_jqXpeLzLGU',
                        range: 'Schedules!A2:K'
                    };
                    let cname_data = await gsapi.spreadsheets.values.get(cname);
                    let cname_array = cname_data.data.values;
                    let object = 0;
                    cname_array.forEach(data => {
                        if (parseInt(data[0], 10) === num && data[10] === 'No') {
                            object += 1;
                        }
                    });
                    return object;
                }
            }
        }
        else {
            message.reply(`Disabled unschedule command in this channel!`);
        }
    }
}