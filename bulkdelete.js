const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sil')
        .setDescription('Sohbette istediğin kadar mesajı silersin!')
        .addIntegerOption(option =>
            option
                .setName('sayı')
                .setDescription('Temizlenecek Mesaj Sayısını Girin.')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        ),
    run: async (interaction) => {
        // Check if the user has the required permissions to manage messages
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            const noPermissionEmbed = new EmbedBuilder()
                .setDescription(':x: | Mesajları Yönetme Yetkin Yok!')
            .setColor("Red")
            return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
        }

        const count = interaction.options.getInteger('sayı');

        try {
            // Fetch the messages from the channel and delete them
            const fetchedMessages = await interaction.channel.messages.fetch({ limit: count });
            await interaction.channel.bulkDelete(fetchedMessages, true);

            const successEmbed = new EmbedBuilder()
                .setTitle('Başarılı')
                .setColor("Green")
                .setDescription(`:white_check_mark: | ${count} adet mesaj başarıyla silindi.`) 
            interaction.reply({ embeds: [successEmbed], ephemeral: true });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(':x: | Botun yetkisi yetersiz.')

            interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    },
};
