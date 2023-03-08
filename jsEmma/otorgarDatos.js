
module.exports.emmaDiceDato = async function(lastChannel,message){
    ///funcion para taguear a alguien aleatorio de los que estan en el chat de texto activo
    function takeRandomGuy(){
        let randomGuy = lastChannel.members.random()
        do{randomGuy = lastChannel.members.random()}while(randomGuy.user.bot)
        return randomGuy = ("<@"+randomGuy+">")
    }
    //funcion para todo tipo de azar
    function RNG(max){
        let random = Math.round(Math.random()*max)
        return random
    }
    //leer el dato JSON con los datos
    const fs = require("fs")
    let datitos
    fs.readFile("./EmmaJSON/datos.JSON",function(err,data){
        if (err){console.log("err")}
        datitos = JSON.parse(data)
        enviarDato()
    })
    function enviarDato(){
        takeRandomGuy()
        let datoEnviar = datitos[RNG(datitos.length-1)]
        let guyOne = takeRandomGuy()
        let guyTwo = takeRandomGuy()
        do{
            guyTwo = takeRandomGuy()
        }while(guyOne === guyTwo)
        let filter = datoEnviar.haveMention
        if (datoEnviar.message.includes("IMGGATO")){
            datoEnviar.message.str.replace("IMGGATO",gato)
        }
        switch(filter){
            case 0:{lastChannel.send(datoEnviar.message);break}
            case 1:{lastChannel.send(datoEnviar.message + guyOne + datoEnviar.messageTwo);break}
            case 2:{lastChannel.send(datoEnviar.message + guyOne + datoEnviar.messageTwo + guyTwo + datoEnviar.messageThree);break}
        }
    }
}