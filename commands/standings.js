const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const Discord = require('discord.js');
const PaginationEmbed = require('discord-paginationembed');

module.exports = {
    name: 'standings',
    aliases: ["standings"],
    description: 'Lists the standings for a particular diivsion!',
    args: true,
    length: 1,
    category: 'Representative',
    usage: 'division_prefix',
    missing: ['`division_prefix`'],
    explanation: `wcl standings b\nwhere b - Blizzard\n
Division - Prefix
B - Blizzard
P - Pirates`,
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

            const match = {
                /*'H' : 'HEAVY WEIGHT!DD3:EH26',
                'C' : 'CHAMPIONS!DD3:EH194',
                'F' : 'FLIGHT!DD3:EH36',
                'E' : 'ELITE!DD3:EH40',
                'B' : 'BLOCKAGE!DD3:EH30',*/
                'B': 'BLIZZARD!DD3:EH34',
                'P': 'PIRATES!DD3:EH98'
            };

            const identifier = {
                /*'H' : 'HEAVY WEIGHT',
                'C' : 'CHAMPIONS',
                'F' : 'FLIGHT',
                'E' : 'ELITE',
                'B' : 'BLOCKAGE',*/
                'B': 'BLIZZARD',
                'P': 'PIRATES'
            };

            const hex = {
                /*'H' : '#01fbfe',
                'F' : '#3d45a2',
                'E' : '#e217e7',
                'B' : '#c50302',
                'C' : '#ffef04',*/
                'B': '#ffcd0b',
                'P': '#93ad22'
            };
            const logo = {
                'B': 'https://media.discordapp.net/attachments/766306826542514178/841324500024688660/Blizzard_Division.png?width=495&height=612',
                'P': 'https://media.discordapp.net/attachments/766306826542514178/841324525954138192/Pirates_Division.png'
            };

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });
                if (match[args[0].toUpperCase()] === undefined) {
                    message.reply(`Invalid division prefix **${args[0].toUpperCase()}**!`)
                }
                const spread = {
                    spreadsheetId: '1MUAL4ERXD1qZeI0-BnPec15hEjNWzVCorhH_Q1V_3EQ',
                    range: match[args[0].toUpperCase()]
                };
                let spread_data = await gsapi.spreadsheets.values.get(spread);
                let spread_array = spread_data.data.values;
                let detail = '';
                let col = 0;
                spread_array.forEach(data => {
                    if (!(data[0] === undefined)) {
                        col++;
                        let fuck = `${col}`;
                        detail += `${(fuck).padEnd(3, ' ')} ${data[0].padEnd(15, ' ')} ${data[30].padEnd(5, ' ')} ${data[3].padEnd(5, ' ')} ${data[4].padEnd(6, ' ')} ${data[6].padEnd(5, ' ')} ${data[7].padEnd(6, ' ')}\n`;
                    }
                });
                const embeds = [];
                const embed1 = new Discord.MessageEmbed()
                    .setColor(hex[args[0].toUpperCase()])
                    .setThumbnail(logo[args[0].toUpperCase()])
                    .setAuthor('By WCL')
                    .setTitle('WCL Standings for ' + identifier[args[0].toUpperCase()])
                    .setDescription("```" + `#   #Clans          R1    *Diff %Dest1 R2    %Dest2\n\n` + detail.slice(0, 1976) + "```")
                    .setTimestamp()
                embeds.push(embed1);
                if (detail.length > 1976) {
                    const embed2 = new Discord.MessageEmbed()
                        .setColor(hex[args[0].toUpperCase()])
                        .setThumbnail(logo[args[0].toUpperCase()])
                        .setAuthor('By WCL')
                        .setTitle('WCL Standings for ' + identifier[args[0].toUpperCase()])
                        .setDescription("```" + `#   #Clans          R1    *Diff %Dest1 R2    %Dest2\n\n` + detail.slice(1976, 3952) + "```")
                        .setTimestamp()
                    embeds.push(embed2);
                }
                if (detail.length > 3952) {
                    const embed2 = new Discord.MessageEmbed()
                        .setColor(hex[args[0].toUpperCase()])
                        .setThumbnail(logo[args[0].toUpperCase()])
                        .setAuthor('By WCL')
                        .setTitle('WCL Standings for ' + identifier[args[0].toUpperCase()])
                        .setDescription("```" + `#   #Clans          R1    *Diff %Dest1 R2    %Dest2\n\n` + detail.slice(3952, 5928) + "```")
                        .setTimestamp()
                    embeds.push(embed2);
                }
                if (detail.length > 5928) {
                    const embed2 = new Discord.MessageEmbed()
                        .setColor(hex[args[0].toUpperCase()])
                        .setThumbnail(logo[args[0].toUpperCase()])
                        .setAuthor('By WCL')
                        .setTitle('WCL Standings for ' + identifier[args[0].toUpperCase()])
                        .setDescription("```" + `#   #Clans          R1    *Diff %Dest1 R2    %Dest2\n\n` + detail.slice(5928, 7904) + "```")
                        .setTimestamp()
                    embeds.push(embed2);
                }
                if (detail.length > 7904) {
                    const embed2 = new Discord.MessageEmbed()
                        .setColor(hex[args[0].toUpperCase()])
                        .setThumbnail(logo[args[0].toUpperCase()])
                        .setAuthor('By WCL')
                        .setTitle('WCL Standings for ' + identifier[args[0].toUpperCase()])
                        .setDescription("```" + `#   #Clans          R1    *Diff %Dest1 R2    %Dest2\n\n` + detail.slice(7904, 9880) + "```")
                        .setTimestamp()
                    embeds.push(embed2);
                }
                if (detail.length > 9880) {
                    const embed2 = new Discord.MessageEmbed()
                        .setColor(hex[args[0].toUpperCase()])
                        .setThumbnail(logo[args[0].toUpperCase()])
                        .setAuthor('By WCL')
                        .setTitle('WCL Standings for ' + identifier[args[0].toUpperCase()])
                        .setDescription("```" + `#   #Clans          R1    *Diff %Dest1 R2    %Dest2\n\n` + detail.slice(9880, detail.length) + "```")
                        .setTimestamp()
                    embeds.push(embed2);
                }
                if (embeds.length === 1) {
                    message.channel.send(embeds[0].setFooter(`1. R1 - OverAll Record\n2. *Diff - Average Star Difference(For-Against)\n3. %Dest1 - Average % Destruction\n4. R2 - OverAll Division Record\n5. %Dest2 - Average Div % Destruction\n\nPage 1/1`));
                }
                else {
                    let m1 = 0;
                    embeds.map(function (r) { m1++; return r.setFooter(`1. R1 - OverAll Record\n2. *Diff - Average Star Difference(For-Against)\n3. %Dest1 - Average % Destruction\n4. R2 - OverAll Division Record\n5. %Dest2 - Average Div % Destruction\n\nPage ${m1}/${embeds.length}`) })
                    const Embeds = new PaginationEmbed.Embeds()
                        .setArray(embeds)
                        .setTimeout(600000)
                        .setChannel(message.channel)
                        // Sets the client's assets to utilise. Available options:
                        //  - message: the client's Message object (edits the message instead of sending new one for this instance)
                        //  - prompt: custom content for the message sent when prompted to jump to a page
                        //      {{user}} is the placeholder for the user mention
                        //.setClientAssets({ prompt: 'Enter the page number between 1-6, you want to jump on {{user}}' })
                        .setDeleteOnTimeout(false)
                        .setDisabledNavigationEmojis(['back', 'forward', 'jump', 'delete'])
                        .setFunctionEmojis({
                            '⏮️': (_, instance) => {
                                instance.setPage(1);
                            },
                            '◀️': (_, instance) => {
                                instance.setPage('back');
                            },
                            '▶️': (_, instance) => {
                                instance.setPage('forward');
                            },
                            '⏭️': (_, instance) => {
                                instance.setPage(3);
                            },
                            '🔃': (_, instance) => {
                                instance.deleteFunctionEmoji();
                            }
                        })
                    //.setEmojisFunctionAfterNavigation(false)
                    // Listeners for PaginationEmbed's events
                    // After the initial embed has been sent
                    // (technically, after the client finished reacting with enabled navigation and function emojis).
                    //.on('start', () => console.log('Started!'))
                    // When the instance is finished by a user reacting with `delete` navigation emoji
                    // or a function emoji that throws non-Error type.
                    //.on('finish', (user) => console.log(`Finished! User: ${user.username}`))
                    // Upon a user reacting on the instance.
                    //.on('react', (user, emoji) => console.log(`Reacted! User: ${user.username} | Emoji: ${emoji.name} (${emoji.id})`))
                    // When the awaiting timeout is reached.
                    //.on('expire', () => console.warn('Expired!'))
                    // Upon an occurance of error (e.g: Discord API Error).
                    //.on('error', console.error);

                    await Embeds.build();
                }
            }
        }
        else {
            message.reply(`Not an appropriate channel to use the command!`);
        }
    }
}