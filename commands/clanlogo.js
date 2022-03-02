const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');

module.exports = {
    name: 'logo',
    aliases: ['logo'],
    description: 'Shows you the clan logo',
    args: true,
    length: 1,
    missing: ['`clan_abbreviation`'],
    usage: 'clan_abb',
    explanation: 'Ex: wcl logo INQ\nwhere INQ is clan_abb',
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

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                let find = await clan(args[0].toUpperCase());

                if (find.length === 1) {
                    message.reply(`Clan Abb : **${args[0].toUpperCase()}** not found!`)
                }

                message.channel.send(find[1]);

                async function clan(name) {
                    const cname = {
                        spreadsheetId: '1sQ6GpLUl9SP447bO2CoyivFNHA4uEJ32yt6c1J2hixM',
                        range: 'ALL DETAILS!A2:E'
                    };
                    let cname_data = await gsapi.spreadsheets.values.get(cname);
                    let cname_array = cname_data.data.values;
                    let object = ['Null']
                    cname_array.forEach(data => {
                        if (data[0] === name) {
                            object.push(data[4])
                        }
                    });
                    return object;
                }
            }
        }
    }
}