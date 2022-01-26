const { MessageEmbed } = require("discord.js");
const db = require("../models/guild");
module.exports = {
    name:"rol-ekle",
    description: 'Yeni rol eklersiniz',
    type:'CHAT_INPUT',
    options:[
        {
            name:"rol",
            description:"eklenicek rolü seçiniz",
            type:8,
            required: true
        },
        {
            name:"açıklama",
            description:"rol için açıklama yazını",
            type:3,
            required: false
        },
        {
            name:"emoji",
            description:"rol için emoji seçiniz",
            type:3,
            required: false
        },
    ],

    run: async (client, interaction) => {
        const rol = interaction.options.getRole("rol");
        const rolAcıklama = interaction.options.getString("açıklama") || null;
        const rolEmoji = interaction.options.getString("emoji") || null;

        if(rol.position >= interaction.guild.me.roles.highest.position)
            return interaction.reply({content:"Seçilen rol benim rolümün üstümde, kullanıcıya bu rolü veremem", ephemeral:true})

        const guildData = await db.findOne({guildId: interaction.guildId})

        const newRole = {
            roleId: rol.id,
            rolAcıklama,
            rolEmoji,
        }

        if(guildData){
            const rolData = guildData.roles.find((x) => x.roleId === rol.id)

            if(rolData){
                rolData = newRole;
            } else {
                guildData.roles = [...guildData.roles, newRole]
            }
            await guildData.save()
        } else {
            await db.create({
                guildId: interaction.guildId,
                roles: newRole
            })
        }

        interaction.reply(`Yeni rol oluşturuldu: ${rol.name}`)
   
}
};