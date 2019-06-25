/* backup code by IiKaReeeM#0001 
* copy right codes
*/


const Discord = require('discord.js')
const bot = new Discord.Client()
const db = require('quick.db') // لا تنسى تحمل البكج ذا , npm i quick.db@7.0.0-b22
const prefix = "@" // تقدر تغيره
// ذا كود الباك اب
bot.on('message', msg => {
  if(msg.author.bot) return
  if(msg.content.startsWith(prefix + 'backup')) {
    db.set(`backup.${msg.author.id}.channels`, [])
    db.set(`backup.${msg.author.id}.roles`, [])
    db.set(`backup.${msg.author.id}.categories`, [])
    let channels = msg.guild.channels.filter(c => c.type === 'text')
    let categories = msg.guild.channels.filter(c => c.type === 'category')
    channels.forEach(c => {
      db.push(`backup.${msg.author.id}.channels`, {cn: c.name, ccn: c.parent.name})

    })
    categories.forEach(c => {
      db.push(`backup.${msg.author.id}.categories`, c.name)

    })

    msg.guild.roles.forEach(r => {
      if(r.name === '@everyone') return
      db.push(`backup.${msg.author.id}.roles`, {rn: r.name, rc: r.color, rp: r.permissions})
    })

    msg.channel.send(`**Done backup this server**`)

  }
})

bot.on('ready', () => {
  console.log(`backup code by IiKaReeeM#0001`)
})


// وذا كود اللود load 
bot.on('message', msg => {
  if(msg.author.bot) return
  if(msg.content.startsWith(prefix + 'load')) {
   let channels = db.get(`backup.${msg.author.id}.channels`)
   let roles = db.get(`backup.${msg.author.id}.roles`)
   let categories = db.get(`backup.${msg.author.id}.categories`)
   if(channels === null && roles === null && categories === null) return msg.channel.send(`**You don't have a backup to be uploaded here.  :/**`)
   msg.channel.send(`**loading...**`).then(m => {
     setTimeout(() => {
                    m.edit(`**done load!**`)
                  },6000);
                })

if(categories != null) {
   for(let j = 0; j < categories.length; j++) {
     msg.guild.createChannel(categories[j], "category")
   }
}
if(roles != null) {
for(let r = 0; r < roles.length; r++) {
 msg.guild.createRole({
   name: roles[r].rn,
   color: roles[r].rc,
   permissions: roles[r].rp
 })
}
}
if(channels != null) {

   for(let i = 0; i < channels.length; i++) {
     msg.guild.createChannel(channels[i].cn, "text").then(channel => {
       channel.setParent(msg.guild.channels.find(c => c.name == channels[i].ccn))
     })
}
}
  }
})


bot.login('NTEzMDg2MjcwOTE0NjkxMDcz.XRKKRQ.1ec50_VPeiXIN5U1ZJpAA82_1F4')
