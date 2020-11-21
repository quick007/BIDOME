const discord = require("discord.js");
const fs = require("fs");
const Database = require("@replit/database")
const botdevs = ["423258218035150849", "314166178144583682"]

const pvideos = ["./assets/pvideos/vid1.mp4", "./assets/pvideos/vid2.mp4", "./assets/pvideos/vid3.mp4"]

async function commands(msg, bot, command, db, prefix) {
  const args = msg.content.toString().split(" ");
  const msgprefix = await db.get("prefix." + msg.guild.id)
  switch (command) {
    /*--------
    Help
    --------*/
    case "help":
      if (!args[1]) return msg.channel.send(new discord.MessageEmbed().setTitle("BIDOME BOT HELP").addField("**🐵 Fun**", "\`Fun commands to\` \n\`pass the time.\`").addField("**🎭 Misc**", "\`General commands that\` \n\`don't fit elsewhere.\`").addField("**👮‍♂️ Admin**", "\`Admin commands\` \n\`and configs.\`").setAuthor("Use " + msgprefix + "help <fun/admin/misc> to view commands!"))
      switch (args[1].toLowerCase()) {
        case "fun":
          return msg.channel.send(new discord.MessageEmbed().setTitle("BIDOME BOT HELP").addField("⮞ **Commands [1]:**", "`joe`"))
          break;
        case "admin":
          return msg.channel.send(new discord.MessageEmbed().setTitle("BIDOME BOT HELP").addField("⮞ **Commands [1]:**", "\`prefix\` \n \n*Make sure to use \`" + msgprefix + "config <arg>\` in your messages!*"))
          break;
        case "misc":
          return msg.channel.send(new discord.MessageEmbed().setTitle("BIDOME BOT HELP").addField("⮞ **Commands [3]:**", "`ping` \n`invite` \n`support`"))
          break;
        default:
          msg.channel.send(new discord.MessageEmbed().setTitle("BIDOME BOT HELP").setDescription("I couldn't find that category! See my categories at `" + msgprefix + "help`"))
          break;
      }
      break;
    /*--------
    Misc
    --------*/
    case "ping":
      let m = await msg.channel.send(new discord.MessageEmbed().setTitle("Bidome bot ping").setDescription("Getting ping!"))
      m.edit(new discord.MessageEmbed().setTitle("Bidome bot ping").setDescription("🏓").addField("Current ping", "**Ping:** `" + (Date.now() - msg.createdTimestamp) + "`ms \n**Websocket ping**: `" + Math.round(bot.ws.ping) + "`ms"))
      break;
    case "invite":
      msg.channel.send(new discord.MessageEmbed().setTitle("Bidome bot Invite").setDescription("Add the bot to your server [**here**](https://discord.com/api/oauth2/authorize?client_id=778670182956531773&permissions=8&scope=bot)."))
      break;
    case "support":
      msg.channel.send(new discord.MessageEmbed().setTitle("Bidome bot Support").setDescription("Get bot support [**here**](https://discord.gg/Y4USEwV) by joining this server and dming me."))
      break;
    case "info":
      let rolesfromeachserver = 0;
      await bot.guilds.cache.forEach(g => {
        rolesfromeachserver = rolesfromeachserver + g.roles.cache.size;
      })
      msg.channel.send(new discord.MessageEmbed().setTitle("Bidome bot info").addFields(
        { name: "Accounts", value: bot.users.cache.size, inline: true },
        { name: "Humans", value: bot.users.cache.filter(member => !member.bot).size, inline: true },
        { name: "Bots", value: bot.users.cache.filter(member => member.bot).size, inline: true },
        { name: "Channels", value: bot.channels.cache.size, inline: true },
        { name: "Servers", value: bot.guilds.cache.size, inline: true },
        { name: "Roles", value: rolesfromeachserver, inline: true }
      ))

      break;
    /*--------
    Admin
    --------*/
    case "config":
      if (!msg.member.hasPermission("ADMINISTRATOR") && !botdevs.includes(msg.author.id)) return;
      if (!args[1]) return msg.channel.send(new discord.MessageEmbed().setTitle("Bidome bot configuration").addField("Options", "`prefix`"))
      switch (args[1].toLowerCase()) {
        case "prefix":
          if (!args[2]) return msg.channel.send(new discord.MessageEmbed().setTitle("Bidome bot configuration").addField("Current prefix", "The current prefix is set to `" + msgprefix + "`"))
          if (args[2].length > 3 || args[2].includes("`") || args[2].includes("*")) return msg.channel.send(new discord.MessageEmbed().setTitle("Bidome bot configuration").addField("Prefix configuration", "Sorry but prefixes are currently limited to 3 characters and cannot use characters like **`** and **\\***"))
          db.set("prefix." + msg.guild.id, args[2].toLowerCase());
          return msg.channel.send(new discord.MessageEmbed().setTitle("Bidome bot configuration").addField("Current prefix", "Changed the prefix to `" + args[2].toLowerCase() + "`"))
          break;
        default:
          msg.channel.send(new discord.MessageEmbed().setTitle("Bidome bot configuration").setDescription("I couldn't find that option! Use \`" + msgprefix + "help admin\` for more commands."))
          break;
      }
      break;
    /*--------
    Fun
    --------*/
    case "joe":
      msg.channel.send(new discord.MessageEmbed().setTitle("BIDOME").setDescription("<:joebidome:776908944240541706> Get Joe bidomed"))
      msg.react("776908944240541706")
      break;
    case "porn":
      msg.channel.send("*Enjoy*  😉", { files: [{ attachment: pvideos[Math.floor(Math.random() * pvideos.length)], name: "SPOILER_porn.mp4" }] })
      break;
  }
} exports.commands = commands