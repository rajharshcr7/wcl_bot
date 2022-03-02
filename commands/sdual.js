const fetch = require('node-fetch');
const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');
const Discord = require('discord.js');

module.exports = {
    name: 'searchdual',
    aliases: ['sdual'],
    description: 'Searches a player in all available duals',
    args: true,
    length: 1,
    category: 'representative',
    usage: 'player_tag',
    missing: ['`player_tag`'],
    explanation: 'wcl sdual #PCV8JQR0V\n\nwhere #PCV8JQR0V - Player Tag',
    execute: async (message, args) => {
        // if(!(message.channel.id === '842739523384901663' || message.channel.id === '842738408648474695' || message.channel.id === '842738445259898880' || message.channel.id === '842738468743413780')) {
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

            message.channel.send(`Processing....`);
            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                const load = await fetch(`http://wclapi.tk/player/` + decodeURIComponent(args[0].slice(1)).replace(/[^\x00-\x7F]/g, ""), options);
                if (load.status === 200) {
                    let abbs = await find(args[0].toUpperCase());
                    if (abbs.length === 1) {
                        message.reply(`**${args[0].toUpperCase()}** isn't rostered in any team participating in WCL!`)
                    }
                    else {
                        let details = '';
                        const clans = {
                            spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                            range: 'Wrong Tag Info!K6:N'
                        };
                        let clans_data = await gsapi.spreadsheets.values.get(clans);
                        let clans_array = clans_data.data.values;
                        clans_array.forEach(data => {
                            if (data[1] === args[0].toUpperCase() && !(data[1] === undefined)) {
                                details += `${data[0].padEnd(4, ' ')} ${data[1].padEnd(12, ' ')} ${data[3].padEnd(2, ' ')} ${data[2].padEnd(15, ' ')}\n`
                            }
                        })
                        const data = await load.json();
                        if (details === '') {
                            message.channel.send(`Player **${data.name}** : **${args[0].toUpperCase()}** isn't dualing in any roster!`);
                        }
                        else {
                            const embed = new Discord.MessageEmbed()
                                .setColor('#29809e')
                                .setAuthor('By WCL')
                                .setTitle(`Dual search for ${data.name}!`)
                                .setThumbnail(`https://coc.guide/static/imgs/other/town-hall-${data.TH}.png`)
                                .setDescription("```" + `Abbs #PTag        TH PName          \n\n` + details + "```")
                                .setTimestamp()

                            message.channel.send(embed);
                        }
                    }

                    async function find(tag) {
                        const cname = {
                            spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                            range: 'ALLROSTERS!N:U'
                        };
                        let cname_data = await gsapi.spreadsheets.values.get(cname);
                        let cname_array = cname_data.data.values;
                        let object = [1];
                        cname_array.forEach(data => {
                            if (data[0] === tag) {
                                object.push(data[7]);
                            }
                        });
                        return object;
                    }
                }
                else {
                    message.reply(`Invalid tag\nOR\nMaintenance break`)
                }
            }
        }
        else {
            message.reply('Not an appropriate channel for the command!');
        }
    }
}