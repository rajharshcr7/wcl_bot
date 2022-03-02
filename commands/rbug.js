const fetch = require('node-fetch');
const { google, GoogleApis } = require('googleapis');
const keys = require('./keys.json');

module.exports = {
    name: 'rbug',
    aliases: ['rbug'],
    args: true,
    length: 2,
    category: "none",
    usage: 'clan_abb clear/status',
    missing: ['`clan_abb`, ', '`clear/status`'],
    explanation: `Ex: wcl rbug clan.abb clear/status\n\nclear - blank cells trigger\nstatus - spot status`,
    accessableby: ['League Admins', 'Moderator'],
    execute: async (message, args) => {
        // if(message.author.id === '531548281793150987' || message.author.id === '602935588018061453')
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

            const control = {
                'BLIZZARD': 50,
                'PIRATES': 8,
            }

            async function gsrun(cl) {
                const gsapi = google.sheets({ version: 'v4', auth: cl });

                const get_status = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0/values/${args[0].toUpperCase()}!D1:D7?majorDimension=ROWS&key=YOURAPIKEY`, options);
                if (args[1].toLowerCase() === 'status') {
                    let count = 0;
                    const get_total = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0/values/${args[0].toUpperCase()}!E10:X79?majorDimension=ROWS&key=YOURAPIKEY`, options);
                    let get_data = await get_status.json();
                    let get_data_values = get_data.values;
                    let total_data = await get_total.json();
                    let total_data_values = total_data.values;
                    let embed = `Add? : ${get_data_values[6][0]}\n\nDetails\n`;
                    total_data_values.forEach(data => {
                        count += 1;
                        if (count < (control[get_data_values[0][0]] + 1)) {
                            embed += `${data[0]}  ${data[19]}\n`;
                        }
                    });
                    message.channel.send('```plaintext\n' + embed + '\n```');
                }
                if (args[1].toLowerCase() === 'clear') {
                    let count = 0;
                    let con = 0;
                    let get_data = await get_status.json();
                    let get_data_values = get_data.values;
                    const get_total = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0/values/${args[0].toUpperCase()}!E10:X79?majorDimension=ROWS&key=YOURAPIKEY`, options);
                    let get_total_values = await get_total.json();
                    get_total_values.values.forEach(data => {
                        con += 1;
                        if (data[19] === 'Yes' && con < (control[get_data_values[0][0]] + 1)) {
                            const clear_tag = {
                                spreadsheetId: '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                                range: args[0].toUpperCase() + '!E' + (9 + con)
                            };
                            gsapi.spreadsheets.values.clear(clear_tag);
                            count += 1;
                        }
                    });
                    message.channel.send(`Spots cleared : ${count}!`);
                }
            }
        }
        else {
            message.reply(`Usage prohibited!`);
        }
    }
}