const fs = require("fs");
const {Client} = require("discord.js")
module.exports = async (client, interaction) => {
    if (interaction.isCommand()){
      try {
        fs.readdir("./slashKomutlar/", (err, files) => {
          if (err) throw err;
  
          files.forEach(async (f) => {
            const command = require(`../slashKomutlar/${f}`);
            if (
              interaction.commandName.toLowerCase() === command.name.toLowerCase()
            ) {
              return command.run(client, interaction);
            }
          });
        });
      } catch (err) {
        console.error(err);
      }
    }
    

     if(interaction.isSelectMenu()){
       if(interaction.customId !== 'reaction-roles') return;
       await interaction.deferReply({ephemeral:true})
       const roleId = interaction.values[0];
       const role = interaction.guild.roles.cache.get(roleId)
       const memberRole = interaction.member.roles;
       
       const hasRole = memberRole.cache.has(roleId);

       if(hasRole){
         memberRole.remove(roleId);
         interaction.followUp({content:`**${role.name}** rolü senden alındı`, ephemeral:true})
       }else {
        memberRole.add(roleId);
        interaction.followUp({content:`**${role.name}** rolü verildi`, ephemeral:true})
       }
     }
   
};