const socket = io()


const mensajesContenedor = document.getElementById('mensajesContenedor')
const mensajeInput = document.getElementById('mensajeInput')
const mensajeEnviar = document.getElementById('mensajeEnviar')
const notificacionesContenedor = document.getElementById('notificacionesContenedor')

console.log({mensajesContenedor, mensajeInput, mensajeEnviar, notificacionesContenedor})

const params = Qs.parse(window.location.search, {
    ignoreQueryPrefix: true
  })


socket.emit("unirseChat", params.username)

socket.on("notificacion", notification => {
    notificacionesContenedor.innerHTML = notification
    
})

mensajeEnviar.addEventListener("click", (e) => {
  const mensaje = mensajeInput.value
  if (mensaje) {
    socket.emit('nuevoMensaje', mensaje)
  }
})

socket.on('mensaje', mensajeString => {
  const mensajeObjeto = JSON.parse(mensajeString)
  mensajesContenedor.innerHTML += `
  <div>${mensajeObjeto.usuario}: ${mensajeObjeto.mensaje}</div>
  `
})



//Para que un usuario nuevo vea todo el historial de mensajes (descomentar si se quiere eso)
/*socket.on('mensajes', mensajesString => {
  const mensajes = JSON.parse(mensajesString)

  mensajes.forEach(mensaje => {
    mensajesContenedor.innerHTML += `
    <div>${mensaje.usuario}: ${mensaje.mensaje}`
  })
})*/