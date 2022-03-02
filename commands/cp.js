const {google, GoogleApis} = require('googleapis');
const keys = require('./keys.json');
const fetch = require('node-fetch');

//400 - range or tab not found
//403 - export sheet link is private
//404 - sheet not found or in trash
//200 - all good
/*
 *  Raedy for launch
 */
module.exports = {
    name : 'transfer',
    aliases : ['trans'],
    description : 'Import-export roster work',
    args : true,
    length : 4,
    author : '531548281793150987',
    trace : `
    else if(data.status === 200) {
        const convert = await data.json();
        if(convert.values[0].length > 1)
            message.reply("The import_range must have single column containing only #players_tags.");
        else{
            convert.values.forEach(data => {
                if(!(data[0] === undefined))/*condition to eliminate blank values*/ {
                    fresh.push([data[0]]);
                } 
            });

            let write = {
                spreadsheetId : '1IrlMRDxI8VF78I9fcy7ohiXGdbQXl_2EHHvTaNixK9Q',
                range : args[2].toUpperCase()+'!B2:B41', //export range to be changed later
                valueInputOption : 'USER_ENTERED',
                resource : {values : fresh}
            };
            try{
                gsapi.spreadsheets.values.update(write);
                message.reply('**Updated**');
            }catch(err)
            {
                console.log(err);
            }
        }
    }`,
    usage : 'import_link import_range export_tab_of_clan_abb',
    missing : ['`import_link`, ','`import_range`, ','`export_tab_of_clan_abb`,','`division_prefix`'],
    explanation : 'wcl trans https://docs.google.com/spreadsheets/d/......../edit#gid=0 ABC!A1:A10 DEF B\n\nwhere\n\nthe first @param is import_link\nsecond @param is import_range\nthird @param is export_range\nfourth @param is division_prefix(B - Blizzard/P - Pirates)',
    execute: async (message,args) => {
        if((message.author.id === '531548281793150987' || message.member.hasPermission("MANAGE_ROLES")) && !(args[0] === 'trace')) {
            const options = {
                'json' : true,
                'Accept' : 'application/json',
                'method' : 'get',
                'muteHttpExceptions' : true
            };

            const client = new google.auth.JWT(
                keys.client_email,
                null,
                keys.private_key,
                ['https://www.googleapis.com/auth/spreadsheets']
            );
            
            client.authorize(function(err, tokens){
            
                if(err) {
                    console.log(err);
                    return;
                }
                else {
                    console.log('Connected!');
                    gsrun(client);
                }
            });

            const division = {
                'B' : 'E10:E59',
                'P' : 'E10:E17'
            };
            const rectifier = {
                'B' : 50,
                'P' : 8
            };
            const div_name = {
                'B' : 'Blizzard',
                'P' : 'Pirates'
            };

            async function gsrun(cl) {
                const gsapi = google.sheets({version : 'v4',auth : cl});

                const new_data = args[0].split('/');
                let data;
                let fresh = [];
                if(new_data.length === 1) {
                    data = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${new_data[0]}/values/${args[1]}?majorDimension=ROWS&key=YOURAPIKEY`,options);
                }
                else if(new_data.length > 1) {
                    data = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${new_data[5]}/values/${args[1]}?majorDimension=ROWS&key=YOURAPIKEY`,options);
                }
                else {
                    message.reply(`Improper format of sheet link!`);
                }
                if(data.status === 400) {
                    message.reply(`Invalid range or tab(**${args[1]}**)!`);
                }
                else if(data.status === 403) {
                    message.reply(`Sheet link or ID(<${args[0]}>) is private!`);
                }
                else if(data.status === 404) {
                    message.reply(`Sheet not found or it's in owner's trash!`);
                }
                else if(data.status === 200) {
                    const convert = await data.json();
                    if(convert.values[0].length > 1)
                        message.reply("The import_range must have single column containing only #players_tags.");
                    else{
                        convert.values.forEach(data => {
                            if(!(data[0] === undefined || data[0] === ' '))/*condition to eliminate blank values*/ {
                                fresh.push([(data[0].trim()).toUpperCase()]);
                            } 
                        });
                        if(!(division[args[3].toUpperCase()] === undefined)) //to check whether the division prefix is correct or not
                        {
                            if(fresh.length <= rectifier[args[3].toUpperCase()]) //to check whether the total accounts doesn't cross the max roster size
                            {
                                let tags = '';
                                fresh.forEach(data => {
                                    tags += data[0]+'\n';
                                });
                                (await message.channel.send('```plaintext\n\nPlayer tags fetched\n\n'+tags+'\n```')).react('✅');
                                (await message).react('✅');
        
                                let write = {
                                    spreadsheetId : '1B269adx2hZNKzsFFZY8FUYdM5DJ3dLYlgqO3BMua6l0',
                                    range : args[2].toUpperCase()+'!'+division[args[3].toUpperCase()], //export range is selected according to the division prefix
                                    valueInputOption : 'USER_ENTERED',
                                    resource : {values : fresh}
                                };
                                try{
                                    gsapi.spreadsheets.values.update(write);
                                    message.reply(`**Updated**\nAccounts added **${fresh.length}**.`);
                                }catch(err)
                                {
                                    console.log(err);
                                }
                            }
                            else
                            {
                                console.log(fresh);
                                message.reply(`Please check that the total accounts in the roster doesn't cross the maximum roster size according to the **${div_name[args[3].toUpperCase()]} Division**!`);
                            }
                        }
                    }
                }
                else {
                    message.reply(`Internal error occured!`);
                }
            }
        }
    }
}