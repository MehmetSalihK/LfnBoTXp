const Discord = require('discord.js');
const Client = new Discord.Client();
const prefix = "-"
const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")

const adapter = new FileSync("database.json")
const db = low(adapter);

var storynumber = db.get("histoires").map("story_value").value();

db.defaults({ histoires: [], xp: []}).write()

Client.on("message", async (message) => {
	if (message.author.bot) return;

	let command = message.content.split(" ")[0];
	command = command.slice(prefix.length);

	if (!message.content.startsWith(prefix)) return;
	var args = message.content.substring(prefix.length).split(" ");

	switch (args[0].toLowerCase()){

		case "newstory":
		var value = message.content.substr(10);
		var author = message.author.toString();
		var number = db.get("histoires").map("id").value();
		var storyid = number + 1;
		console.log(value);
		message.reply("Ajout de l'histoire a la base de données")

		db.get("histoires")
		  .push({ story_value: value, story_author: author})
		  .write();
		break;

		case "tellstory" :

		story_random();
		console.log(randnum);

		var story = db.get(`histoires[${randnum}].story_value`).toString().value();
		var author_story = db.get(`histoires[${randnum}].story_author`).toString().value();
		console.log(story);

		message.channel.send(`Voici l'histoire : ${story} (Histoire de ${author_story})`)

		break;
	}
	
	var msgauthor = message.author.id;

	if(message.author.bot)return;

	if(!db.get("xp").find({user: msgauthor}).value()){
		db.get("xp").push({user: msgauthor, xp: 1}).write();
	}else{
		var userxpdb = db.get("xp").filter({user: msgauthor}).find("xp").value();
		console.log(userxpdb);
		var userxp = Object.values(userxpdb)
		console.log(userxp);
		console.log(`Nombre d'xp : ${userxp[1]}`)

		db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();

	}

	if (command.content === prefix + "xpstat"){
		var xp = db.get("xp").filter({user: msgauthor}).find("xp").value()
		var xpfinal = Object.values(xp);
		var xp_embed = new Discord.RichEmbed()
			.setTitle(`XP de ${message.author.username}`)
			.setDescription("Voici tout vos xp monsieur !")
			.addField("XP :", `${xpfinal[1]} xp`)
		message.channel.send({embed: xp_embed});
	}

	if (command == "xplfn") {
		message.delete (30);
		var xp = db.get("xp").filter({user: msgauthor}).find("xp").value()
		var xpfinal = Object.values(xp);
		var xp_embed = new Discord.RichEmbed()
		const embed = new Discord.RichEmbed()
		.setColor(0x00ffff)
		.addField(message.author.username, "Roles: " + message.member.roles.map(role => role.name).join(", ")) // user, roles
		.addField("XP :", `${xpfinal[1]}`)
		.setThumbnail(message.author.avatarURL)
		message.channel.send({embed});
	}

	if (command == "Profile") {
		const embed = new Discord.RichEmbed()
	   .addField(message.author.username, "Roles: " + message.member.roles.map(role => role.name).join(", ")) // user, roles
	   .addField("Stats", "XP: 0/100 Level 0") // XP, Level?
	   .setColor(0x00ffff)
	   .setThumbnail(message.author.avatarURL)
	   message.channel.send({embed});
	console.log(message.author + ` Viewed their profile!`)
	}

	if (command == "adminxpa") {
		message.delete (30);
		var xp = db.get("xp").filter({user: msgauthor}).find("xp").value()
		var xpfinal = Object.values(xp);
		var xp_embed = new Discord.RichEmbed()
		const embed = new Discord.RichEmbed()
		.setColor(0x954D23)
		.setTitle(`XP de ${message.author.username}`)
		.setDescription("Voici tout vos xp monsieur !")
		.addField("XP :", `${xpfinal[1]} xp`)
		message.channel.send({embed});
	}
	

});

function story_random(min, max) {
	min = Math.ceil(0);
	max = Math.floor(storynumber);
	randnum = Math.floor(Math.random() * (max - min +1) + min);
}

Client.login("NDI5NzQ1ODg4MTUyNTE4Njcx.DcQYkw.KQPqEBDUVpftE91JHmdwvkCanqs");
