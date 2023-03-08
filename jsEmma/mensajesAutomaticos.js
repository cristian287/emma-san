module.exports.emmaMensajesHorarios = async function(lastChannel){
    let horaActual
    let amPm
    let hora
    const dias = ["domingo","lunes","martes","miercoles","jueves","viernes","sabado"]
    const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
      momentoActual = new Date()
      diaActual = dias[momentoActual.getDay()]
      fechaActual = momentoActual.getDate()
      mesActual = meses[momentoActual.getMonth()]
      horaActual = momentoActual.getHours()
      hora = horaActual
      amPm = hora >=12?"pm":"am"
      hora = (horaActual%12) || 12
      minuto = momentoActual.getMinutes()
      console.log("Este es un día " + diaActual + " con fecha " + fechaActual + " del mes " + mesActual + ". La hora actual es " + hora + ":" + minuto + amPm)
      console.log(hora,minuto)
      if (lastChannel !== undefined){
        if ((hora === 12) && (amPm === "pm") && (minuto === 0)){
          lastChannel.send("Son las 12:00. ya es demaciado tarde, deberian dormir :v o podriamos jugar a las preguntas toda la noche ;V ")
        }
        else if ((hora === 3) && (amPm === "am") && (minuto === 33)){
          lastChannel.send("A dormir.  Esta hora salen duendes y todos saben que roban las medias izquierdas pero solo las izquierdas ya que les encanta ver como las buscas")
        }
        else if ((hora === 3) && (amPm === "am") && (minuto === 0)){
          lastChannel.send("ya casi es la hora peligrosa por que no van a dormir ?")
        }
        else if ((hora === 12) && (amPm === "am") && (minuto === 0)){
          lastChannel.send( randomGuy + "paga la siguiente ronda de papitas :)")
        }
        else if ((hora === 4) && (amPm === "am") && (minuto === 0)){
          lastChannel.send(" Fiu ... la hora maldita por fin termino ... no? ")
        }
        else if ((hora === 7) && (amPm === "am") && (minuto === 30)){
          lastChannel.send("HEY... muchos se levantan a trabajar a esta hora asi que los ayudo a despertar :V")
        }
        else if ((hora === 12) && (amPm === "pm") && (minuto === 0)){
          lastChannel.send("BUENOS DIAS. :v Espero que todos tengan la fuerza para afrontar un nuevo dia :V")
        }
        else if ((hora === 3) && (amPm === "pm") && (minuto === 0)){
          lastChannel.send("que dicen?, vamos por un almuerzo?")
        }
        else if ((hora === 6) && (amPm === "pm") && (minuto === 0)){
          lastChannel.send("Bueno señores, a esta hora ya casi todos sueltan la pala. Bedwars?")
        }
        else if ((hora === 8)&& (amPm === "pm") && (minuto === 0)){
          lastChannel.send("Escucharon este mensaje y pensaron que un amigo les hablaba? xd ")
        }
        else if ((hora === 11) && (amPm === "pm") && (minuto === 30)){
          lastChannel.send("Bueno, esta hora es la hora asi que deberian ir a dormir:V")
        }
        else if ((hora === 12) && (amPm === "am") && (minuto === 25)){
            lastChannel.send("Bip boop")
          }
      }
}