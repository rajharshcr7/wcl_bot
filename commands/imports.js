const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const Discord = require('discord.js');
const PaginationEmbed = require('discord-paginationembed');

module.exports = {
    name: 'viewwars',
    aliases: ['fw', 'vw', 'wr'],
    description: 'Imports official wcl wars',
    args: true,
    length: 1,
    usage: 'clan_abb',
    missing: ['`clan_abb`'],
    explanation: `Ex : wcl fw INQ\nwhere INQ is clan_abb`,
    execute: async (message, args) => {
        // if(!(message.channel.id === '842739523384901663' || message.channel.id === '842738408648474695' || message.channel.id === '842738445259898880' || message.channel.id === '842738468743413780')) {
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

            const identifier = {
                /*'HEAVY WEIGHT' : '!G1:AY1',
                'FLIGHT' : '!G26:AY26',
                'ELITE' : '!G61:AY61',
                'BLOCKAGE' : '!G100:AO100',
                'CHAMPIONS' : '!G129:AE129',*/
                'BLIZZARD': '!G1:AE1',
                'PIRATES': '!G34:AE34',
            };
            const hex = {
                /*'HEAVY WEIGHT' : '#01fbfe',
                'FLIGHT' : '#3d45a2',
                'ELITE' : '#e217e7',
                'BLOCKAGE' : '#c50302',
                'CHAMPIONS' : '#ffef04',*/
                'BLIZZARD': '#ffcd0b',
                'PIRATES': '#93ad22',
            };
            const logo = {
                'BLIZZARD': 'https://media.discordapp.net/attachments/766306826542514178/841324500024688660/Blizzard_Division.png?width=495&height=612',
                'PIRATES': 'https://media.discordapp.net/attachments/766306826542514178/841324525954138192/Pirates_Division.png'
            };

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                let find = await clan(args[0].toUpperCase());

                if (find.length === 1) {
                    message.reply(`**${args[0].toUpperCase()}** not found!`)
                }
                let find_group = await group(find);
                const spread = {
                    spreadsheetId: '1MUAL4ERXD1qZeI0-BnPec15hEjNWzVCorhH_Q1V_3EQ',
                    range: 'Resource' + identifier[find[1]]
                };
                let spread_data = await gsapi.spreadsheets.values.get(spread);
                let num = spread_data.data.values;

                const spreading = {
                    spreadsheetId: '1MUAL4ERXD1qZeI0-BnPec15hEjNWzVCorhH_Q1V_3EQ',
                    range: 'Resource!E2:AY'
                };
                let spreading_data = await gsapi.spreadsheets.values.get(spreading);
                let spreading_array = spreading_data.data.values;
                let count = 0;
                let newspreading_array = [];
                spreading_array.forEach(data => {
                    newspreading_array.push(spreading_array[count].map(function (r) { return r === '' ? '-' : r; })); //replaces each blank array value with '-'
                    count++;
                });
                newspreading_array.forEach(data => {
                    newspreading_array.map(function (r) {
                        while (r.length < 47) {
                            r.push('-');
                        }
                        return r;
                    });
                });
                let store = '';
                if (find[1] === 'HEAVY WEIGHT' || find[1] === 'FLIGHT' || find[1] === 'ELITE') {
                    newspreading_array.forEach(data => {
                        if (args[0].toUpperCase() === data[0]) {
                            store += `${num[0][0].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[2].padEnd(15, ' ')} ${data[3].padEnd(1, ' ')} ${data[4].padEnd(4, ' ')} ${data[5].padEnd(4, ' ')} ${data[6].padEnd(5, ' ')}
${num[0][5].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[7].padEnd(15, ' ')} ${data[8].padEnd(1, ' ')} ${data[9].padEnd(4, ' ')} ${data[10].padEnd(4, ' ')} ${data[11].padEnd(5, ' ')}
${num[0][10].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[12].padEnd(15, ' ')} ${data[13].padEnd(1, ' ')} ${data[14].padEnd(4, ' ')} ${data[15].padEnd(4, ' ')} ${data[16].padEnd(5, ' ')}
${num[0][15].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[17].padEnd(15, ' ')} ${data[18].padEnd(1, ' ')} ${data[19].padEnd(4, ' ')} ${data[20].padEnd(4, ' ')} ${data[21].padEnd(5, ' ')}
${num[0][20].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[22].padEnd(15, ' ')} ${data[23].padEnd(1, ' ')} ${data[24].padEnd(4, ' ')} ${data[25].padEnd(4, ' ')} ${data[26].padEnd(5, ' ')}
${num[0][25].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[27].padEnd(15, ' ')} ${data[28].padEnd(1, ' ')} ${data[29].padEnd(4, ' ')} ${data[30].padEnd(4, ' ')} ${data[31].padEnd(5, ' ')}
${num[0][30].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[32].padEnd(15, ' ')} ${data[33].padEnd(1, ' ')} ${data[34].padEnd(4, ' ')} ${data[35].padEnd(4, ' ')} ${data[36].padEnd(5, ' ')}
${num[0][35].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[37].padEnd(15, ' ')} ${data[38].padEnd(1, ' ')} ${data[39].padEnd(4, ' ')} ${data[40].padEnd(4, ' ')} ${data[41].padEnd(5, ' ')}
${num[0][40].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[42].padEnd(15, ' ')} ${data[43].padEnd(1, ' ')} ${data[44].padEnd(4, ' ')} ${data[45].padEnd(4, ' ')} ${data[46].padEnd(5, ' ')}`;
                        }
                    });
                }
                if (find[1] === 'BLOCKAGE') {
                    newspreading_array.forEach(data => {
                        if (args[0].toUpperCase() === data[0]) {
                            store += `${num[0][0].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[2].padEnd(15, ' ')} ${data[3].padEnd(1, ' ')} ${data[4].padEnd(4, ' ')} ${data[5].padEnd(4, ' ')} ${data[6].padEnd(5, ' ')}
${num[0][5].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[7].padEnd(15, ' ')} ${data[8].padEnd(1, ' ')} ${data[9].padEnd(4, ' ')} ${data[10].padEnd(4, ' ')} ${data[11].padEnd(5, ' ')}
${num[0][10].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[12].padEnd(15, ' ')} ${data[13].padEnd(1, ' ')} ${data[14].padEnd(4, ' ')} ${data[15].padEnd(4, ' ')} ${data[16].padEnd(5, ' ')}
${num[0][15].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[17].padEnd(15, ' ')} ${data[18].padEnd(1, ' ')} ${data[19].padEnd(4, ' ')} ${data[20].padEnd(4, ' ')} ${data[21].padEnd(5, ' ')}
${num[0][20].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[22].padEnd(15, ' ')} ${data[23].padEnd(1, ' ')} ${data[24].padEnd(4, ' ')} ${data[25].padEnd(4, ' ')} ${data[26].padEnd(5, ' ')}
${num[0][25].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[27].padEnd(15, ' ')} ${data[28].padEnd(1, ' ')} ${data[29].padEnd(4, ' ')} ${data[30].padEnd(4, ' ')} ${data[31].padEnd(5, ' ')}
${num[0][30].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[32].padEnd(15, ' ')} ${data[33].padEnd(1, ' ')} ${data[34].padEnd(4, ' ')} ${data[35].padEnd(4, ' ')} ${data[36].padEnd(5, ' ')}`;
                        }
                    });
                }
                if (find[1] === /*'CHAMPIONS'*/ 'BLIZZARD' || find[1] === 'PIRATES') {
                    newspreading_array.forEach(data => {
                        if (args[0].toUpperCase() === data[0]) {
                            store += `${num[0][0].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[2].padEnd(15, ' ')} ${data[3].padEnd(1, ' ')} ${data[4].padEnd(4, ' ')} ${data[5].padEnd(4, ' ')} ${data[6].padEnd(5, ' ')}
${num[0][5].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[7].padEnd(15, ' ')} ${data[8].padEnd(1, ' ')} ${data[9].padEnd(4, ' ')} ${data[10].padEnd(4, ' ')} ${data[11].padEnd(5, ' ')}
${num[0][10].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[12].padEnd(15, ' ')} ${data[13].padEnd(1, ' ')} ${data[14].padEnd(4, ' ')} ${data[15].padEnd(4, ' ')} ${data[16].padEnd(5, ' ')}
${num[0][15].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[17].padEnd(15, ' ')} ${data[18].padEnd(1, ' ')} ${data[19].padEnd(4, ' ')} ${data[20].padEnd(4, ' ')} ${data[21].padEnd(5, ' ')}
${num[0][20].padEnd(3, ' ')} ${data[1].padEnd(15, ' ')} ${data[22].padEnd(15, ' ')} ${data[23].padEnd(1, ' ')} ${data[24].padEnd(4, ' ')} ${data[25].padEnd(4, ' ')} ${data[26].padEnd(5, ' ')}`;
                        }
                    });
                }
                let col = '';
                find_group.forEach(data => {
                    if (!(isNaN(data[0]))) {
                        let num = `${data[0]}`;
                        col += `${num.padEnd(2, ' ')} ${data[1].padEnd(15, ' ')} ${data[2].padEnd(6, ' ')} ${data[3].padEnd(5, ' ')} ${data[4].padEnd(6, ' ')}\n`;
                    }
                });
                const embed = [];
                const embed1 = new Discord.MessageEmbed()
                    .setColor(hex[find[1]])
                    .setThumbnail(logo[find[1]])
                    .setTitle(`Per Week Record for ${find[2]}`)
                    .setAuthor('By WCL')
                    .setDescription("```" + `#Wk For             Against         W/L/T *F *A %` + "```" + `\n\n` + "```" + store + "```")
                    .setFooter(`*F - Stars For\n*A - Stars Against\n% - Percentage Destruction\nNote - The W/L/T, *For and % are of the "For" Team\nMobile users are requested to see the preview in landscape mode 📟\n\nPage 1/2`)
                    .setTimestamp();
                embed.push(embed1);
                const embed2 = new Discord.MessageEmbed()
                    .setColor(hex[find[1]])
                    .setThumbnail(logo[find[1]])
                    .setTitle(`Group Record for ${find[2]}/Conference ${find_group[0][0]}`)
                    .setAuthor('By WCL')
                    .setDescription("```" + `## #Clans          Record *Diff *%` + "```" + `\n\n` + "```" + col + "```")
                    .setFooter(`Record - Overall Division/Group Record\n*Diff - Group's Average *Diff\n*% - Groups's Average %Dest.\nMobile users are requested to see the preview in landscape mode 📟\n\nPage 2/2`)
                    .setTimestamp();
                embed.push(embed2);

                const embeds = new PaginationEmbed.Embeds()
                    .setArray(embed)
                    .setTimeout(300000)
                    .setChannel(message.channel)
                    .setDeleteOnTimeout(false)
                    .setDisabledNavigationEmojis(['jump', 'delete'])
                    .setFunctionEmojis({
                        '🔃': (_, instance) => {
                            instance.deleteFunctionEmoji();
                        }
                    })
                    .setEmojisFunctionAfterNavigation(true)
                await embeds.build();
                async function clan(name) {
                    const cname = {
                        spreadsheetId: '1MUAL4ERXD1qZeI0-BnPec15hEjNWzVCorhH_Q1V_3EQ',
                        range: 'Resource!A2:D'
                    };
                    let cname_data = await gsapi.spreadsheets.values.get(cname);
                    let cname_array = cname_data.data.values;
                    let object = [''];
                    cname_array.forEach(data => {
                        if (data[3] === name) {
                            object.push(data[0], data[2]);
                        }
                    });
                    return object;
                }

                async function group(name) {
                    const gname = {
                        spreadsheetId: '1MUAL4ERXD1qZeI0-BnPec15hEjNWzVCorhH_Q1V_3EQ',
                        range: name[1] + '!D3:E194'
                    };
                    let gname_cname = await gsapi.spreadsheets.values.get(gname);
                    let garray = gname_cname.data.values;

                    let fuck = [];

                    garray.forEach(data => {
                        if (name[2].toLowerCase() === data[1].toLowerCase()) {
                            garray.forEach(adata => {
                                if (data[0] === adata[0]) {
                                    fuck.push([data[0]]);
                                }
                            });
                        }
                    });

                    const sname = {
                        spreadsheetId: '1MUAL4ERXD1qZeI0-BnPec15hEjNWzVCorhH_Q1V_3EQ',
                        range: name[1] + '!DD3:EI194'
                    };
                    let sname_data = await gsapi.spreadsheets.values.get(sname);
                    let sname_array = sname_data.data.values;
                    let groups = [];
                    let count = 1;

                    groups.push([fuck[0][0]]);
                    sname_array.forEach(sdata => {
                        if (sdata[31] === fuck[0][0]) {
                            groups.push([count, sdata[0], sdata[6], sdata[3], sdata[7]]);
                            count++;
                        }
                    });
                    return groups;
                }
            }
        }
        else {
            message.reply(`Not an appropriate channel!`);
        }
    }
}