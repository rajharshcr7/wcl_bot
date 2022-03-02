const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./auth.json');
const mongoose = require('mongoose');
const bot = new Discord.Client();
const moment = require('moment');
require('moment-duration-format');
require('dotenv/config');
mongoose.connect(process.env.CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('Connected to DB'))
	.catch((err) => console.log(err.message))

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

bot.once('ready', () => {
	console.log('Ready!');
});

bot.on('message', async message => {
	if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = bot.commands.get(commandName)
		|| bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (commandName.toLowerCase() === 'ins' || commandName.toLowerCase() === 'inspect') {
		//Uptime
		const duration = moment.duration(bot.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

		//Memory Usage
		var os = require('os');

		var usedMemory = os.totalmem() - os.freemem(), totalMemory = os.totalmem();

		var getpercentage =
			((usedMemory / totalMemory) * 100).toFixed(2) + '%'

		//console.log("Memory used in GB", (usedMemory/ Math.pow(1024, 3)).toFixed(2))
		//console.log("Used memory" , getpercentage);      
		//message.channel.send(`Memory Usage **${process.memoryUsage().heapUsed/1024/1024}** MB`);

		const mu = process.memoryUsage().heapUsed / 1024 / 1024;

		const embed = new Discord.MessageEmbed()
			.setAuthor(`By WCL TECHNICAL`, 'https://media.discordapp.net/attachments/766306691994091520/804653857447477328/WCL_BOt.png')
			.setTitle(`Inspect`)
			.addField('Uptime', duration)
			.addField('CPU', `Memory : ${(usedMemory / Math.pow(1024, 3)).toFixed(2)} GB\nMemory Usage : ${mu.toString().substring(0, 7)} MB\nRAM : ${getpercentage}`)
			.setFooter(`By WCL TECHNICAL`)
			.setTimestamp()
		message.channel.send(embed);
	}

	if (!command) return /*message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`)*/;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (args[0] === 'trace' && command.author === message.author.id)
		(await message.channel.send('```js\n' + command.trace + '\n```')).react('🔁');
	else if (command.args && (command.length > args.length)) {
		let count = args.length;
		let c = '';
		for (var i = count; i < command.missing.length; i++) {
			c += command.missing[i];
		}
		if (command.usage) {
			const embed = new Discord.MessageEmbed()
				.setColor('#208e9e')
				.setTitle(command.name.toUpperCase())
				.setAuthor('By WCL')
				.setDescription(command.description)
				.addField('Missing Details/Data', c)
				.addField('**Usage**', `**${prefix} ${command.aliases}** ` + "`" + command.usage + "`" + `\n` + "```" + command.explanation + "```", true)
				.setFooter(`Not enough parameters`)
				.setTimestamp()
			return message.channel.send(embed);
		}
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

bot.login(token);