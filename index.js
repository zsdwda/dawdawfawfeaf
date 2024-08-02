const { Client, Intents, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const rules = require('./rules.json');
const fs = require('fs');
const { startServer } = require("./alive.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);
});


client.on('messageCreate', async message => {
  if (message.content === '!zkmt') {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('قائمة القوانين')
            .addOptions(rules.map(rule => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            }))),
        );

      const embed = new MessageEmbed()
        .setColor('#f8ca3d')
.setThumbnail('https://cdn.discordapp.com/attachments/1235681302582394910/1238042557276225586/rules.gif?ex=663dd87b&is=663c86fb&hm=3888a5e09175106495da576e91b40d8fc068bdef3c99b1ee6f1c5d07ab407625&')
        .setTitle('القوانين')
        .setDescription('**الرجاء اختيار احد القوانين لقرائته من قائمة الاختيارات تحت**')
        .setImage("https://cdn.discordapp.com/attachments/1232750963022888970/1236877218907557939/rules1.gif?ex=663aecad&is=66399b2d&hm=4196a65444183ca41c699448b2beaec87547cb501ea7794d3afa910af0cf3e76&")
        .setFooter({ text: 'Revolt' })
        .setTimestamp();

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
      await message.delete();
    } else {
      await message.reply({ content: "You need to be an administrator to use this command.", ephemeral: true });
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find(r => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, 'utf-8');
    const ruleEmbed = new MessageEmbed()
      .setColor('#f8ca3d')
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: 'zkmt' })
      .setTimestamp();

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

startServer();

client.login(process.env.TOKEN);
