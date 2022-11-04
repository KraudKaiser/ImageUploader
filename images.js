const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const multer = require("multer")
const fs = require("fs")
const path = require("path")
require("dotenv/config")
const imgModel = require("./model")


mongoose.connect(process.env.MONGO_URI,console.log("Connected Succesfully"))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.set("view engine", "ejs")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads") //creamos una funcion de destino para el archivo en cuestion. llamado uploads
    },
    filename:(req, file,cb) =>{
        cb(null, file.fieldname + "-" + Date.now())
    } //creamos una funcion para el nombre del archivo que contiene su nombre, separando un guion con la fecha de ahora
})

const upload = multer({storage: storage}) //y por ultimo se sube a storage

app.get("/", (req, res) =>{
    imgModel.find({}, (err, items) =>{
        if(err){
            console.log(err)
            res.status(500).send("An error has ocurred", err)
        }else{
            res.render(path.join(__dirname + "/views/imagesPages"), {items: items})
        }
    })
}) //creo un metodo get para recibir las imagenes de la pagina

app.post("/", upload.single("image"), (req, res, next) =>{
    const obj = {
        name: req.body.name,
        desc: req.body.desc,
        img:{
            data: fs.readFileSync(path.join(__dirname + "/uploads/" + req.file.filename)),
            contentType: "image/png"
        }
    }
    imgModel.create(obj, (err, item) =>{
        if(err){
            console.log(err)
        }else{
            item.save()
            res.redirect("/")
        }
    })
})

const port = process.env.PORT ||"3000"

app.listen(port, err =>{
    if(err) throw err
    console.log("server listening on port", port)
})