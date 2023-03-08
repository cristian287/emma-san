const { Client, Intents, GatewayIntentBits, EmbedBuilder, MessageAttachment} = require("discord.js");
const Discord = require("discord.js")
const client = new Client({ intents: [32767,GatewayIntentBits.MessageContent,GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildVoiceStates,GatewayIntentBits.MessageContent,]});
const { createAudioPlayer, createAudioResource,joinVoiceChannel,VoiceConnection } = require('@discordjs/voice');
const ytdl = require("ytdl-core-discord")
const yts = require("yt-search");
const fs = require("fs")
const { stream } = require("undici");
require("dotenv").config()


//Comandos de Emma
client.on("messageCreate", async (message)=>{
  if ((message.mentions.has(client.user) && (message.author.bot === false) && (message.content.startsWith("<@")))){
    let finalMessage = message.content.slice(22).trim()
    if ((stop === false)|| (stopContraseña === false)){
      return message.reply("No se llama a alguien jugando! Puedes usar 'terminar el juego' para que podamos volver a charlar")
    }
    const ordenarEmma = require("./jsEmma/ordenarEmma.js")
    ordenarEmma.comandosEmma(client,finalMessage,message,lastChannel)
    //Ordenar a Emma: Jugar a las preguntas
    if(finalMessage.startsWith("juguemos a las preguntas")){
      message.reply("Juguemos! Recuerda mencionarme y decir ' Terminar el juego ' cuando quieras detenerte y para el jueo :V")
      stop = false
      juego()
    }
    //Ordenar a Emma: Jugar a la contraseña

    else if (finalMessage.startsWith("juguemos a la contraseña")){
      message.reply("Juguemos!")
      juegoContraseña()
    }
  }
})
//Juego de preguntas
let preguntaRandom
let usuariosPreguntasPuntos = []
function juego(){ 
  fs.readFile("./EmmaJSON/preguntas.JSON",function(err,data){
    if (err){console.log("err")}
    preguntas = JSON.parse(data)
    preguntaRandom = preguntas[RNG(preguntas.length-1)]
    stop = false
    console.log(preguntaRandom)
    lastChannel.send(preguntaRandom.pregunta)
  })  
}
client.on("messageCreate",(message)=>{
  if ((stop === false) && (message.content.toLowerCase() !== "terminar el juego")){
    for(let i = -1; i<preguntaRandom.respuesta.length;i++){
      if (message.content.toLowerCase() === (preguntaRandom.respuesta[i])){
        message.reply("Correctisimo :v! Esa persona tiene mas cultura que el resto")
        let actualUser = message.author.username
        let userExists = usuariosPreguntasPuntos.filter(e => e.user === actualUser)
        if (userExists.length !== 0){
          for(let i = 0;i<usuariosPreguntasPuntos.length;i++){
            if (usuariosPreguntasPuntos[i].user === actualUser){
              usuariosPreguntasPuntos[i].points++
            }
          }
        }
        else{
          usuariosPreguntasPuntos.push({user:actualUser,points:1})
        }
        juego()
      }
    }
  }
  else if (message.content.toLowerCase() === "terminar el juego"){
    usuariosPreguntasPuntos.sort((a,b)=>(a.points<b.points) ? 1 : (a.points>b.points) ? -1 : 0)
    message.reply("Juego de preguntas terminado! Una lastima :v pero estare al tanto por si quieren volver a jugar :] ")
    let embedRespuestas = new EmbedBuilder()
        .setTitle("Resultados juego de preguntas")
        .setColor("#ffc0cb")
        .setDescription("...Y ahora a trasforma sus respuestas en puntos SI!! PUNTOS. Todos han jugado muy bien :D. Pero estos jugadores son los que mejor lo hicieron.")
        .setFooter({text:"Estaria encantada de que volvieramos a jugar todos juntos otra vez nya"})
        .setTimestamp()
        usuariosPreguntasPuntos.forEach(function(a,index){
          if (index<=4){embedRespuestas.addFields({name:"<@"+a.user+">",value:"Este jugador acertó " + a.points + " respuestas, increíble!"})}}
        )
    message.reply({embeds:[embedRespuestas]})
    preguntaRandom = undefined
    stop = true
    usuariosPreguntasPuntos = []
  }
})

//Juego contraseña
let stopContraseña = true
let contraseña = undefined
let intentosContraseña = 0
function juegoContraseña(){
  stopContraseña = false
  contraseña = Math.floor(Math.random() * (9999 - 1000) + 1000)
  contraseña = contraseña.toString()
  setTimeout(() => {
    lastChannel.send("hey hey, tengo pensado un número de 4 digitos, intenten adivinarlo! creen que podran? soy muy buena en esto :V")
  }, 400);
}
client.on("messageCreate",(message)=>{
  if ((stopContraseña === false)){
    if (((/^[0-9]+$/).test(message.content) && (message.content.length === 4))){
      intentosContraseña++
      console.log(contraseña)
      let embedRespuestasPreguntas = new EmbedBuilder()
        .setTitle("Juego de la contraseña")
        .setColor("#ffc0cb")
        .setDescription("Veamos que han descubierto hasta ahora!")
        .setTimestamp()
      if (message.content === contraseña){
        embedRespuestasPreguntas.addFields({name:"<@"+message.author.username+">",value:"Ganaste el juego, felicidades! La contraseña era " + contraseña + " y se tomaron " + intentosContraseña + " intentos"})
        message.reply({embeds:[embedRespuestasPreguntas]})
        stopContraseña = true
      }
      else{
        let corrects = 0
        console.log("Entrando al else")
        for (let i = 0;i<message.content.length;i++){
          for (let z = 0;z<contraseña.length;z++){
            if ((message.content[i] == contraseña[z]) && (i == z)){
              corrects++
              embedRespuestasPreguntas.addFields({name:"Pista:",value:"El numero " + message.content[i] + " va en la posición " + (i+1)})
            }
          }
        }
        if (corrects === 0){
          embedRespuestasPreguntas.addFields({name:":(",value:"Ese numero no tiene nada que ver con el que estoy pensando!"})
        }
        message.reply({embeds:[embedRespuestasPreguntas]})
      }
    }
    else if (message.content === "terminar el juego"){
      stopContraseña === true
      message.reply("Eligieron terminar el juego! Se quedarán con la duda de cuál era la contraseña :)")
    }
  }
})
let secondsCheck = 0
let lastRememberedId = 0
let inactiveChatSeconds = 5000
let stop = true
let timeToAnswerGame = 25
let emmaState = undefined
let respuestaOtorgada
fs.readFile("./EmmaJSON/botStateArray.JSON",function(err,data){
  if (err){console.log("err")}
  emmaStates = JSON.parse(data)
})
///funcion de aleatoriedad
function RNG(max){
    let random = Math.round(Math.random()*max)
    return random
}
//apartir de aca empieza el codigo de inicio de Emma
client.on("ready",() =>{
  secondsCheck = 0
  checkTimer()
  console.log(`Logged in as ${client.user.tag}!`); //Actividad de Emma
  console.log("Emma esta ahora Online!")
  setInterval(() => {
    const index = Math.floor(Math.random() * (emmaStates.length - 1) + 1);
    client.user.setActivity(emmaStates[RNG(emmaStates.length - 1)]);
  }, 60000);
})

let respuesta
fs.readFile("./EmmaJSON/respuestas.JSON",function(err,data){
  if (err){console.log("err")}
  respuesta = JSON.parse(data)
})
client.on("messageCreate", (message)=> {
  if (stop){
    lastChannel= message.channel
    lastAuthor = message.author
    lastId = message.id
    if (message.author.bot === false){
      const emmaResponde = require("./jsEmma/respuestasAutomaticas.js")
      emmaResponde.respuestasEmma(message,respuesta,lastChannel,client)
    }
  }  
})


let lastChannel = undefined
let lastAuthor = undefined
let lastId = undefined
let delayEntreMensajes = 100000 // diley entre mensajes automaticos 



client.on("ready", ()=>{ 
   checkMessageHour()  
})


client.on("messageCreate",(message)=>{
  if ((stop) && (!message.author.bot)){
    if(message.content.toLowerCase() === "meme"){toReddit(message,false)}
    if(message.content.toLowerCase() === "yo tengo mucho sexo con animales"){toReddit(message,true)}
  }
})
function toReddit(message,extra){
  const funcionReddit = require("./jsEmma/mensajesReddit.js")
  funcionReddit.redditMensajes(message,extra)
}



function checkMessageHour(){
  setTimeout(() => {
    const revisarMensajesHora = require("./jsEmma/mensajesAutomaticos.js")
    revisarMensajesHora.emmaMensajesHorarios(lastChannel)
    checkMessageHour()
  }, 60000);
}



function checkTimer(){
  setTimeout(() => {
    if (lastId === undefined){}
    else if(lastRememberedId === lastId){
      secondsCheck++
      if (secondsCheck === inactiveChatSeconds){
        if (lastAuthor.username !== "Emma-San"){
          datazo(message)
        }
        secondsCheck = 0
      }
    }
    else{
      lastRememberedId = lastId
      secondsCheck = 0
    }
    checkTimer()
  }, 1000);
}


function datazo(message){
  const datoEmma = require("./jsEmma/otorgarDatos.js")
  console.log(datoEmma)
  datoEmma.emmaDiceDato(lastChannel,message)
}
//Feliz año nuevo a todos :) Ojala todos puedan cumplir sus sueños este año y podamos ser todos felices :) Vamos por otro años juntos

///TOKEN SUPER IMPORTANTE PARA LA ESTABILIDAD DEL UNIVERSO NO BORRAR 
client.login(process.env.DISCORD_TOKEN)
///TOKEN SUPER IMPORTANTE PARA LA ESTABILIDAD DEL UNIVERSO NO BORRAR 