const express = require("express")
const handlebars = require("express-handlebars")
const viewsRouterFn = require("./routers/chatViewsRouter")
const socketServer = require("./utils/io")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//CORS:
app.use(cors())

//Configurando handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", "./views")
app.set("view engine", "handlebars")

app.use(express.static("public"))

//SocketServer
const PORT = process.env.PORT || 8080

const httpServer = app.listen(PORT, () => console.log(`Listen on port ${PORT}`))
const io = socketServer(httpServer)

const users = []
const mensajesArray = []

io.on("connection", socket => {
    console.log("Nuevo cliente conectado", socket.id)

    socket.on("unirseChat", username => {
        users.push({
            nombre: username,
            socketId: socket.id
        })
        socket.broadcast.emit('notificacion', `${username} se ha unido al chat`)
        socket.emit('notificacion', `Te has unido al chat como ${username}`)

        //Para que un usuario nuevo vea todo el historial de mensajes (descomentar el emit y en la parte del frontend en index.js)
        //socket.emit('mensajes', JSON.parse(mensajesArray))
    })

    socket.on('nuevoMensaje', mensaje => {
        const usuario = users.find(u => u.socketId === socket.id)
        const nuevoMensaje = {
            mensaje,
            usuario: usuario.nombre
        }
        mensajesArray.push(nuevoMensaje)

        io.emit('mensaje', JSON.stringify(nuevoMensaje))
    })
})

app.get("/healthcheck", (req, res) => {
    return res.json({
        status: "Corriendo",
        date: new Date()
    })
})

const viewsRouter = viewsRouterFn(io)

app.use("/", viewsRouter)