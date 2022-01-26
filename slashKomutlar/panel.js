const { Client,CommandInteraction,MessageEmbed,MessageActionRow, MessageSelectMenu } = require("discord.js");
const db = require("../models/guild");
module.exports = {
    name:"panel",
    description: 'rol paneli',
    type:'CHAT_INPUT',
    options:[],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        const guildData = await db.findOne({ guildId: interaction.guildId });
        if(!guildData?.roles) return interaction.reply("bu sunucu hakkanda veri bulunamadı");

        const options = guildData.roles.map(x => {
            const role = interaction.guild.roles.cache.get(x.roleId);

            return {
                label: role.name,
                value: role.id,
                description: x.rolAcıklama || "Açıklama Belirtilmedi",
                emoji: x.rolEmoji
            };
        });

        const panelEmbed = new MessageEmbed()
        .setTitle("Lütfen Rol Seçiniz")
        .setColor("AQUA")

        const components = [
            new MessageActionRow().addComponents(
                new MessageSelectMenu()
                .setCustomId('reaction-roles')
                .setMaxValues(1)
                .addOptions(options)
            )
        ];
        await interaction.reply({content:"Gönderildi"});
        interaction.channel.send({embeds:[panelEmbed], components});
    }
};