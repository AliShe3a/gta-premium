const Discord = require('discord.js');
const client = new Discord.Client();
const sql = require('sqlite');
const path = require('path');
const prefix = "@";
sql.open(path.join(__dirname, 'credits.sql')) // read sql file
.then(() => { // then ?
	console.log('Opened') // if the sql opened
	sql.run(`CREATE TABLE IF NOT EXISTS creditSysteme (id VARCHAR(30), credits BIGINT, timeDaily BIGINT)`) // create new table if the table does'nt exosts
})
.catch(err => console.error(err)) // if the sql file does'nt exists

const ms = require('parse-ms'); // package time ? 
client.on("message", async msg => { // event message
	if(!msg.channel.guild) return; // channel guild
	let men = msg.mentions.users.first() || msg.author; // the mention or the author
	let prize =  msg.content.split(" ").slice(2).join(" ") // prize

	if(msg.content.startsWith(prefix+"credits")) { // if the message content credits do 
		if(!men || !men === undefined) return msg.channel.send("** :interrobang: | "+men.username+", I can't find "+men.username+"!**"); // undefind user
		if(!prize) {
		sql.get(`SELECT * FROM creditSysteme WHERE id = '${men.id}'`).then(res => { // select user from table
			if(!res) sql.run(`INSERT INTO creditSysteme VALUES ('${men.id}', 0, 0)`) // if the user does'nt exisit in table
			if(res) { // if user exsist
					msg.channel.send("**"+men.username+" :credit_card: balance is ``"+res.credits+"$``.**") // reply
			}
		})
		}else{ // else ?
			if(isNaN(prize)) return msg.channel.send(" :interrobang: | "+msg.author.username+", type the credit you need to transfer!"); // is nan :)
			if(parseFloat(prize) === NaN) return msg.channel.send(" :interrobang: | "+msg.author.username+", type the credit you need to transfer!"); // if nan :))
			if(men === msg.author) return; // if the men = author
			let authorRes = await sql.get(`SELECT * FROM creditSysteme WHERE id = '${msg.author.id}'`) // select from sql
			let userRes = await sql.get(`SELECT * FROM creditSysteme WHERE id = '${men.id}'`) // select from sql
			if(!authorRes) sql.run(`INSERT INTO creditSysteme VALUES ('${msg.author.id}', 0, 0)`) // if !user create new col 
			if(!userRes) sql.run(`INSERT INTO creditSysteme VALUES ('${men.id}', 0, 0)`) // if !user create new col 
			let authorCredits = authorRes.credits; // credits before transfer
			let userCredits = userRes.credits; // credits before transfer
			if(parseFloat(prize) > authorCredits) return msg.channel.send("** :thinking: | "+msg.author.username+", Your balance is not enough for that!**"); // if the balance hight then prize
			sql.run(`UPDATE creditSysteme SET credits = ${authorCredits - parseInt(prize)} WHERE id = '${msg.author.id}'`); // uptade credits for the author
			sql.run(`UPDATE creditSysteme SET credits = ${userCredits + parseInt(prize)} WHERE id = '${men.id}'`); // update credits for the mentions user
			msg.channel.send("**:moneybag: | "+msg.author.username+", has transferred ``$"+prize+"`` to "+men.toString()+"**") // the message :)
		}
	} else if(msg.content.startsWith(prefix+"daily")) {  // if the message content daily do
		let daily = 86400000; // 24h
		let amount = Math.floor((Math.random() * 500) + 1) // Money
    let res = await sql.get(`SELECT * FROM creditSysteme WHERE id = '${msg.author.id}'`) // select from sql
		if(!res) sql.run(`INSERT INTO creditSysteme VALUES ('${men.id}', 0, 0)`) // if !user create new col 
    let time = res.timeDaily; // select last daily
    let credits = res.credits; // credits before daily
    if(time != null && daily - (Date.now() - time) > 0) { // if already climed the daily in same day

			let fr8 = ms(daily - (Date.now() - time)); // the remining time
			msg.channel.send("**:stopwatch: | "+msg.author.username+", your daily :yen: credits refreshes in "+fr8.hours+" hours and "+fr8.seconds+" seconds. **") //reply

		}else{ // if does'nt clim her daily in 24h
			msg.channel.send("**:atm:  |  "+msg.author.username+", you received your :yen: "+amount+" daily credits!**"); // reply
			sql.run(`UPDATE creditSysteme SET credits = ${credits + amount}, timeDaily = ${Date.now()} WHERE id = '${msg.author.id}'`); // add amount to the credits before daily
		}
	}
})

client.login("process.env.BOT_TOKEN")
