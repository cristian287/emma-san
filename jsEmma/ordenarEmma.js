module.exports.comandosEmma = async function(client,finalMessage,message,lastChannel){
    const { Client, Intents, GatewayIntentBits, EmbedBuilder, MessageAttachment} = require("discord.js");
    const ytdl = require("ytdl-core-discord")
    const yts = require("yt-search");
    const { stream } = require("undici");
    const { createAudioPlayer, createAudioResource,joinVoiceChannel,VoiceConnection } = require('@discordjs/voice');
     //ordenar a emma: reproducir una cancion
     if (finalMessage.startsWith("reproduce")){
        finalMessage = finalMessage.slice(9)
        const user = await message.member.fetch()
        let channel = await user.voice.channel
        const connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator
        })
        let args = finalMessage
        const {videos} = await yts(args)
        if (!videos.length) return message.reply("No pude encontrar ninguna canción :(");
        const song = {
          title: videos[0].title,
          url: videos[0].url
        }
        message.reply("Genial estoy lista. Ahora te cantaré :" + song.url)
        const emmaCanta = createAudioPlayer()
        const stream = await ytdl(song.url,{filter:"audioonly",quality: 'highestaudio',highWaterMark: 1})
        const resource = createAudioResource(stream)
        connection.subscribe(emmaCanta)
        await emmaCanta.play(resource)
      }


    //Ordenar a Emma: Dar un Dato
    else if (finalMessage.startsWith("dame un dato")){
        if (lastChannel === undefined){return message.reply("Vuelve a intentarlo, no estaba lista!")}
        const datoEmma = require("../jsEmma/otorgarDatos.js")
        datoEmma.emmaDiceDato(lastChannel,message)
    }


    //Ordenar a Emma: Menu de ayuda
    else if (finalMessage.startsWith("help")){
      let embedDatos = new EmbedBuilder()
          .setTitle("Lista de comandos Emma")
          .setColor("#ffc0cb")
          .setDescription("Aún estoy en me estoy desarrollando por que estoy chikita, pero puedes llamarme con <@" +client.user + "> y estoy para lo que necesites!")
          .setFooter({text:"No te olvides de escribir bien los mensajes para que pueda entenderte :)"})
          .setTimestamp()
          .addFields({name:"help", value:"Dime esto para que pueda ayudarte a saber todo lo que puedo hacer y pedirme ayuda (Abrir este menu). Siempre megusta extenderte una mano :v",inline:true})
          .addFields({name:"reproduce + (nombre de cancion)", value:"usa este comando para que me una a un chat de voz y cante algo"})
          .addFields({name:"dame un dato", value:"Te contare un dato que seguramente no sabias :3"})
          .addFields({name:"juguemos a las preguntas/terminar el juego", value:"Con eso me diras cuando quieras empezar o termianr el juego de preguntas que tengo para ti :)"})
          .addFields({name:"juguemos a la contraseña/terminar el juego", value:"Con eso me diras cuando quieras empezar o termianr el juego de la contraseña que tengo para ti :)"})
      message.reply({embeds:[embedDatos]})
    }
    //Ordenar a Emma: Comando no reconocido
    else{
      message.reply("Hola <@" + message.author.id + ">,  veo que intentas decirme algo pero no logre entenderte :V. No te olvides que puedes preguntarme por lo que puedo hacer por ti llamandome y diciendome 'help' ")
    }
}