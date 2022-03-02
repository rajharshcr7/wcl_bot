const fetch = require('node-fetch');
const Discord = require('discord.js');
const PaginationEmbed = require('discord-paginationembed');
module.exports = {
    name: 'checkroster',
    aliases: ['checkroster', 'cr'],
    description: 'Scans the rostered players',
    args: true,
    length: 1,
    missing: ['`{clan.tag}/{clan.abb}`'],
    usage: '{clan.tag}/{clan.abb}',
    explanation: 'Ex: wcl checkroster INQ\n\nwhere INQ is the clan.abb',
    execute: async (message, args) => {
        // if(!(message.channel.id === '842739523384901663' || message.channel.id === '842738408648474695' || message.channel.id === '842738445259898880' || message.channel.id === '842738468743413780'))
        if (message.author.id === '531548281793150987') {
            const options = {
                'json': true,
                'Accept': 'application/json',
                'method': 'get',
                'muteHttpExceptions': true
            };

            const abb_check = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0/values/CLANS!D4:F?majorDimension=ROWS&key=YOURAPIKEY`, options);
            let tag = `${args[0].toUpperCase()}`;
            let stop = 0;
            if (abb_check.status === 200) {
                const get_abbs = await abb_check.json();
                get_abbs.values.forEach(data => {
                    if (data[2] === args[0].toUpperCase() && stop === 0) {
                        tag = data[0];
                        stop++;
                    }
                });
            }
            const source = await fetch(`http://wclapi.tk/clan/${tag.slice(1)}/currentwar`, options);
            if (source.status === 200) {
                const source_data = await source.json();
                if (source_data.state === 'notInWar') {
                    message.reply(`Clan **${tag}** is not in war!`);
                }
                else if (source_data.reason === 'accessDenied') {
                    message.reply(`Clan **${tag}** has private war log.`)
                }
                else if (source_data.reason === 'notFound') {
                    message.reply(`Unknown entry **${tag}**.`);
                }
                const collect_for = [];
                const collect_against = [];
                let a = 0;
                for (const data of source_data.clan.members) {
                    if (!(data.attacks === undefined)) {
                        for (const data2 of data.attacks) {
                            a++;
                        }
                        collect_for.push([data.tag, data.name, data.townhallLevel, data.mapPosition, a]);
                        a = 0;
                    }
                    else {
                        a = 0;
                        collect_for.push([data.tag, data.name, data.townhallLevel, data.mapPosition, a]);
                    }
                }
                let b = 0;
                for (const data of source_data.opponent.members) {
                    if (!(data.attacks === undefined)) {
                        for (const data2 of data.attacks) {
                            b++;
                        }
                        collect_against.push([data.tag, data.name, data.townhallLevel, data.mapPosition, b]);
                        b = 0;
                    }
                    else {
                        b = 0;
                        collect_against.push([data.tag, data.name, data.townhallLevel, data.mapPosition, b]);
                    }
                }
                let sort_clan = sort(collect_for);
                let sort_against = sort(collect_against);
                let for_team = '';
                sort_clan.forEach(data => {
                    for_team += `${data[0].padEnd(12, ' ')} ${(`${data[2]}`).padEnd(2, ' ')} ${(`${data[4]}`).padEnd(1, ' ')} ${data[1].padEnd(15, ' ')}\n`;
                });
                let against_team = '';
                sort_against.forEach(data => {
                    against_team += `${data[0].padEnd(12, ' ')} ${(`${data[2]}`).padEnd(2, ' ')} ${(`${data[4]}`).padEnd(1, ' ')} ${data[1].padEnd(15, ' ')}\n`;
                });
                let unrostered = 'ALL ROSTERED\nOR\nNON-LEAGUE WAR';
                let get = '';
                if (stop === 1) {
                    get = await roster_check(args[0].toUpperCase(), sort_clan);
                    if (get.length > 0) {
                        unrostered = get;
                    }
                }
                const embed = [];
                const emded_1 = new Discord.MessageEmbed()
                    .setAuthor('By WCL Technical')
                    .setTitle(`Clan : ${source_data.clan.name} | ${source_data.clan.tag}`)
                    .setColor('#f53704')
                    .setThumbnail('https://media.discordapp.net/attachments/766306826542514178/841324537169969172/Summer_Kickoff.png')
                    .setDescription("```" + `#TAG         TH # Player Name` + `\n\n` + for_team.slice(0, for_team.length) + "```")
                    .addField('Unrostered Players Status', "```" + unrostered + "```", true)
                    .setTimestamp()
                embed.push(emded_1);

                const emded_2 = new Discord.MessageEmbed()
                    .setAuthor('By WCL Technical')
                    .setTitle(`Clan : ${source_data.opponent.name} | ${source_data.opponent.tag}`)
                    .setColor('#f53704')
                    .setThumbnail('https://media.discordapp.net/attachments/766306826542514178/841324537169969172/Summer_Kickoff.png')
                    .setDescription("```" + `#TAG         TH # Player Name` + `\n\n` + against_team.slice(0, against_team.length) + "```")
                    .setTimestamp()
                embed.push(emded_2);

                let m1 = 0;
                embed.map(function (r) { m1++; return r.setFooter(`# - No. of attacks used\nPage ${m1}/${embed.length}`) })
                const Embeds = new PaginationEmbed.Embeds()
                    .setArray(embed)
                    .setTimeout(300000)
                    .setChannel(message.channel)
                    // Sets the client's assets to utilise. Available options:
                    //  - message: the client's Message object (edits the message instead of sending new one for this instance)
                    //  - prompt: custom content for the message sent when prompted to jump to a page
                    //      {{user}} is the placeholder for the user mention
                    //.setClientAssets({ prompt: 'Enter the page number between 1-6, you want to jump on {{user}}' })
                    .setDeleteOnTimeout(false)
                    .setDisabledNavigationEmojis(['all'])
                    .setDisabledNavigationEmojis(['back', 'forward', 'jump', 'delete'])
                    .setFunctionEmojis({
                        '◀️': (_, instance) => {
                            instance.setPage('back');
                        },
                        '▶️': (_, instance) => {
                            instance.setPage('forward');
                        },
                    })
                await Embeds.build();

                function sort(array) {
                    let th = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14], [15], [16], [17], [18], [19], [20], [21], [22], [23], [24], [25], [26], [27], [28], [29], [30], [31], [32], [33], [34], [35], [36], [37], [38], [39], [40], [41], [42], [43], [44], [45], [46], [47], [48], [49], [50]];
                    let sorted_array = [];
                    th.forEach(element => {
                        array.forEach(data => {
                            if (data[3] === element[0]) {
                                sorted_array.push([data[0], data[1], data[2], data[3], data[4]]);
                            }
                        });
                    });
                    return sorted_array;
                }
                async function roster_check(abb, sort_clan) {
                    const roster_check = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0/values/${abb}!E10:E79?majorDimension=ROWS&key=YOURAPIKEY`, options);
                    const roster_values = await roster_check.json();
                    let unrostered = '';
                    let count = 0;
                    sort_clan.forEach(data_sort => {
                        roster_values.values.forEach(data_roster => {
                            if (data_sort[0] === data_roster[0]) {
                                count++;
                            }
                        });
                        if (count === 0) {
                            unrostered += `${data_sort[0].padEnd(12, ' ')} ${(`${data_sort[2]}`).padEnd(2, ' ')} ${data_sort[1].padEnd(15, ' ')}\n`;
                        }
                        count = 0;
                    });
                    if (unrostered.length > 0) {
                        unrostered = `#TAG         TH Player Name\n\n` + unrostered.slice(0, unrostered.length);
                    }
                    return unrostered;
                }
            }
            else {
                message.reply(`Something went wrong\nOR\nWrong tag entered!`);
            }
        }
        else {
            message.reply(`Not an appropriate channel to run the command!`);
        }
    }
}