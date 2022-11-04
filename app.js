const express = require("express")
const app = express()
const multer = require("multer")
const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")
require("dotenv/config")
const bodyParser = require("body-parser")
const artModel = require("./article")

mongoose.connect(process.env.MONGO_URI_ARTICULO,console.log("Connected Succesfully"))

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static(__dirname + "/views"))
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
    artModel.find({}, (err, items)=>{
        if(err){
            console.log(err)
        }else{
            res.render(path.join(__dirname + "/views/articles"), {items:items})
        }
    })
})

app.post("/", upload.single("image"), (req,res,next)=>{
    const obj = {
        name: req.body.name,
        desc: req.body.desc,
        price:parseInt(req.body.price),
        color:req.body.color,
        image:{
            data: fs.readFileSync(path.join(__dirname + "/uploads/" + req.file.filename)),
            contentType: "image/png"
        }
    }
    artModel.create(obj, (err, item) =>{
        if(err){
            console.log(err)
        }else{
            item.save()
            res.redirect("/")
        }
    })
})

const port = process.env.PORT || 3000

app.listen(port, () =>{
    console.log("Server is running on port", port)
})
