const { MessageEmbed } = require("discord.js");
const db = require("../models/guild");
module.exports = {
    name:"rol-sil",
    description: 'rol silersiniz',
    type:'CHAT_INPUT',
    options:[
        {
            name:"rol",
            description:"eklenicek rolü seçiniz",
            type:8,
            required: true
        },
    ],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const rol = interaction.options.getRole("rol");

        const guildData = await db.findOne({ guildId: interaction.guildId });
        if(!guildData) return interaction.reply("bu sunucu hakkanda veri bulunamadı");

        const guildRoles = guildData.roles;
        const findRole = guildRoles.find((x) => x.roleId === rol.id);
        if(!findRole) return interaction.reply("Bu rol zaten eklenmemiş")

        const filteredRoles = guildRoles.filter((x) => x.roleId !== rol.id)
        guildData.roles = filteredRoles;

        await guildData.save();

        interaction.reply(`Rol Silindi: ${rol.name}`)
    }
};