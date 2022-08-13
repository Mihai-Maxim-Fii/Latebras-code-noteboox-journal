const express = require("express")
const dotenv = require("dotenv")
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const cookieParser = require("cookie-parser")

const cors = require("cors")
dotenv.config({path: "./config.env"})


const verify_user = require("./middleware/auth")

const user_posts = require("./routes/user-api/posts")
const user_gets = require("./routes/user-api/gets")
const private_entries_posts = require("./routes/private-entries-api/posts")
const private_entries_gets = require("./routes/private-entries-api/gets")
const private_entries_puts = require("./routes/private-entries-api/puts")
const private_entries_patches = require("./routes/private-entries-api/patches");
const priate_entries_deletes = require("./routes/private-entries-api/deletes")
const app = express()

const mongo = require("mongoose")
const req = require("express/lib/request");


let user_refresh_tokens = []

const get_user_refresh_tokens = () => {
    return user_refresh_tokens
}

const add_user_refresh_token = (token) => {
    user_refresh_tokens.push(token)
} 



app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cookieParser())
app.use(fileUpload())


app.use(cors({ origin: true, credentials: true }))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header("Origin"));
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Set-Cookie");
    
    next();
});

app.use(verify_user)

app.use("/user-api", user_posts)
app.use("/user-api", user_gets)
app.use("/private-entries-api", private_entries_posts)
app.use("/private-entries-api", private_entries_gets)
app.use("/private-entries-api", private_entries_puts)
app.use("/private-entries-api", private_entries_patches)
app.use("/private-entries-api", priate_entries_deletes)


mongo.connect(process.env.DB_STRING).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Listening at port ${
            process.env.PORT
        }`)
    })
})
