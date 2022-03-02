const fetch = require('node-fetch');
const moment = require('moment');

module.exports = {
    name : 'fetch',
    aliases : ['scan'],
    description : 'Checks the latest banned clan visitation',
    args : true,
    length : 1,
    author : '531548281793150987',
    trace : `
    dt_array.values.forEach(data => {
        if(!(data[0] === undefined)) {
            ar.forEach(data1 => {
                if(data[0] === data1[0] && a === 0) {
                    const format = data1[1].split('-');
                    if(formated[0] === format[0]) {
                        if((parseInt(formated[1],10)-4) <= (parseInt(format[1],10)) && (data1[2] > 2) && a === 0) {
                            pull(data1[0],data1[1],data1[2]);
                            a++;
                        }
                    }
                    else {
                        if((((parseInt(formated[1],10)+12) - parseInt(format[1],10)) <= 4) && (data1[2] > 2) && a === 0 ) {
                            pull(data1[0],data1[1],data1[2]);
                            a++;
                        }
                    }
                }
            });
        }
    });`,
    usage : 'player_tag',
    missing : ['`player_tag`'],
    explanation : `wcl scan #PCV8JQR0V\nwhere #PCV8JQR0V is player tag`,
    execute: async (message,args) => {
        if(message.guild.id === '765523244332875776' && !(args[0] === 'trace'))/*to be changed before tournament*/ {
            const options = {
                'json' : true,
                'Accept' : 'application/json',
                'method' : 'get',
                'muteHttpExceptions' : true
            };
            const dt = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1qckELKFEYecbyGeDqRqItjSKm02ADpKfhkK1FiRbQ-c/values/Banned Clans!C6:C?majorDimension=ROWS&key=YOURAPIKEY`,options);
            const dt_array = await dt.json();
            const data = await fetch(`https://api.clashofstats.com/players/${args[0].slice(1)}/history/clans/`);
            const load = await data.json();
            const ar = [];
            for(const ld of load.log) {
                if(ld.tag === undefined || ld.tag === '') {
                    continue;
                }
                else if(!(ld.start === undefined) && !(ld.end === undefined) && !(ld.start === '') && !(ld.end === '')) {
                    let differentDays = Math.ceil(ld.duration / (1000 * 3600 * 24));
                    let date = ld.start.split('T');
                    ar.push([ld.tag,date[0],differentDays]);
                }
            }
            message.channel.send('Running....');
            
            const today = new Date();
            let format = moment().format('YYYY-MM-DD',today);
            let formated = format.split('-');
            let a = 0;
            dt_array.values.forEach(data => {
                if(!(data[0] === undefined)) {
                    ar.forEach(data1 => {
                        if(data[0] === data1[0] && a === 0) {
                            const format = data1[1].split('-');
                            if(formated[0] === format[0]) {
                                if((parseInt(formated[1],10)-4) <= (parseInt(format[1],10)) && (data1[2] > 2) && a === 0) {
                                    pull(data1[0],data1[1],data1[2]);
                                    a++;
                                }
                            }
                            else {
                                if((((parseInt(formated[1],10)+12) - parseInt(format[1],10)) <= 4) && (data1[2] > 2) && a === 0 ) {
                                    pull(data1[0],data1[1],data1[2]);
                                    a++;
                                }
                            }
                        }
                    });
                }
            });
            async function pull(data1,data2,data3) {
                const dt = await fetch(`http://wclapi.tk/clan/${data1.slice(1)}`,options);
                const result = await dt.json();
                let found = `Visited banned clan : **${data1}** : **${result.name}** on ${data2} for ${data3} days.`;
                message.channel.send(found);
            }
            if(a===0) {
                message.channel.send('`Account is clean.`');
            }
        }
    }
}