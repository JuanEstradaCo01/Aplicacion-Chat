const { Router } = require("express")
const UserDao = require("../dao/UserDao")
const userDao = new UserDao()

const viewsRouterFn = (io) => {

    const viewsRouter = new Router()

    const users = []

    viewsRouter.get("/", (req, res) => {
        return res.redirect("/login")
    })

    viewsRouter.get("/login", (req, res) => {
        return res.render("login")
    })


    viewsRouter.post("/login", async (req, res) => {
        const user = req.body

        const username = user.nombre

        //Genero un color aleatorio:
        const color = "#" + ((1 << 24) * Math.random() | 0).toString(16);

        //Registro el usuario en la base de datos
        const newUser = {
            name: username,
            color: color
        }
        await userDao.addUser(newUser)

        users.push(username)

        //io.emit("newUser", username)

        return res.redirect(`/chat?username=${username}`)
    })


    viewsRouter.get("/chat", (req, res) => {
        return res.render("index")
    })

    return viewsRouter
}



module.exports = viewsRouterFn