const socket = io()


const mensajesContenedor = document.getElementById('mensajesContenedor')
let mensajeInput = document.getElementById('mensajeInput')
let mensajeEnviar = document.getElementById('mensajeEnviar')
const notificacionesContenedor = document.getElementById('notificacionesContenedor')

const params = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true
})

socket.emit("unirseChat", params.username)

socket.on("notificacion", notification => {
  notificacionesContenedor.innerHTML = notification
})

mensajeEnviar.addEventListener("click", () => {
  let mensaje = mensajeInput.value
  if (mensaje) {
    socket.emit('nuevoMensaje', mensaje)
  }
})

//Genero un color aleatorio:
const color = "#" + ((1 << 24) * Math.random() | 0).toString(16);

socket.on('mensaje', mensajeString => {
  const mensajeObjeto = JSON.parse(mensajeString)
  mensajeInput.innerHTML = ""
  mensajesContenedor.innerHTML += `
  <div style= "display: flex;"><p style="color: ${color}; font-weigth: bolder;">${mensajeObjeto.usuario}: </p> <p style="margin-left: .35rem;">${mensajeObjeto.mensaje}</p></div>
  `
})

//Para que un usuario nuevo vea todo el historial de mensajes (descomentar si se quiere eso)
/*socket.on('mensajes', mensajesString => {
  const mensajes = JSON.parse(mensajesString)

  mensajes.forEach(item => {
    mensajesContenedor.innerHTML +=
      `
  <div style= "display: flex;"><p style="color: ${color}; font-weigth: bolder;">${item.usuario}: </p> <p style="margin-left: .35rem;">${item.mensaje}</p></div>
  `
  })
})*/