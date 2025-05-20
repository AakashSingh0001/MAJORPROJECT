const express = require("express")
const app = express();
const users = require("./routes/user.js")
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const path = require("path")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret:"mysupersecretstring",
    resave: false,
    saveUninitialized : true,
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success")
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register", (req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    // res.send(name);
    if(name === "anonymous") {
        req.flash("error", "user not registered")
    } else {
    req.flash("success", "user registerd successfully!")
    }
    res.redirect("/hello")
})

app.get("/hello", (req,res)=>{
    // console.log(req.flash("success"))
    res.render("page.ejs", {name : req.session.name})
})

// app.get("/reqcount", (req,res) => {
//     if(req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You send a request ${req.session.count} time`)
// } )

// app.get("/test", (req,res) => {
//     res.send("test succesfully")
// })



//Router And Cookies

// const cookieParser = require("cookie-parser")


// app.use(cookieParser("secretCode"));

// app.get("/getsignedcookie", (req,res)=>{
//     res.cookie("Made-in", "India", {signed: true})
//     res.send("signed cookie send")
// })

// app.get("/verify", (req,res)=>{
//     console.log(req.signedCookies);
//     res.send("Verified")
// })

// app.get("/getcookies", (req,res)=>{
//     res.cookie("name","Aakash Singh");
//     res.cookie("MadeIn", "India");
//     res.send("sent you some cookies")
// })

// app.get("/greet", (req,res)=>{
//     let {name = "Anonymos"} = req.cookies;
//     res.send(`Hi , ${name}`)
// })

// app.get("/", (req,res)=>{
//     console.dir(req.cookies)
//     res.send("Root is working")
// })

// app.use("/", users)

// //POST
// //Index
// app.get("/post",(req,res)=>{
//     res.send("This is post root")
// })

// //new
// app.get("/post/new", (req,res)=>{
//     res.send("This is post/new root")
// })

// //edit
// app.get("/post/edit",(req,res)=>{
//     res.send("This is edit root")
// })

app.listen(3000, ()=> {
    console.log("App is listen on port 3000")
})

