module.exports = {
    name: 'changesize',
    aliases: ['cs'],
    description: 'Fixes addition spot status',
    args: true,
    length: 1,
    category: 'author',
    missing: ['`divIdentifier`'],
    usage: 'divIdentifier',
    explanation: 'divIdentifier\n\nheavy, flight, elite, blockage, champions',
    execute: async (message, args) => {
        if (message.author.id === '531548281793150987') {
            var rSize = {
                'HEAVY': 80,
                'FLIGHT': 60,
                'ELITE': 50,
                'BLOCKAGE': 40,
                'CHAMPIONS': 8
            };
            var options = {
                'HEAVY': ['heavy', 'rosterSchemaHeavy'],
                'FLIGHT': ['flight', 'rosterSchemaFlight'],
                'ELITE': ['elite', 'rosterSchemaElite'],
                'BLOCKAGE': ['blockage', 'rosterSchemaBlockage'],
                'CHAMPIONS': ['champions', 'rosterSchemaChampions']
            };
            var rosterSchema = require('./rosterSchemas/' + options[args[0].toUpperCase()][1])

            var getData = await rosterSchema.find();
            getData.forEach(async data => {
                if (data.rosterSize === rSize[args[0].toUpperCase()]) {
                    data.additionSpot = 'No';
                    await data.save().then((data) => { console.log(data) }).catch((err) => console.log(err.message));
                }
            });
            message.reply(`Completed ✅!`);
        } else {
            message.reply(`You can't use this command!`);
        }
    }
}