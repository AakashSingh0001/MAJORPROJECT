const express = require("express")
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")   // use ejs-mate as the rendering engine
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("./schema.js")
const Review = require("./models/review.js");
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")


const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")

const cookieParser = require("cookie-parser");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to db")
}).catch((err) => {
    console.log(err)
})

async function  main() {    
    await mongoose.connect(MONGO_URL)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname,"/public" )));



const sesssionOption = {
    secret : "mysuperstringsecret",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 , //this is in the milisecond form
        maxAge : 7*24*60*60*1000,
        httpOnly :  true,
    }
}

app.use(session(sesssionOption))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser)

app.get("/", (req,res) => {
    res.send("working")
})

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    next();
})


app.get("/demouser", async (req,res) => {
   let fakeUser = new User({
    email : "aakashsingh@gmail.com",
    username : "aakash-singh001"
   })
   let registerdUser = await User.register(fakeUser , "password@001" )
   res.send(registerdUser)
})


app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter)






// app.get("/manager",(err,req,res)=>{
//     throw new ExpressError(405,"WTF man, what is your problem")
// })





// app.get("/testListing", async (req,res)=> {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "by the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing")
// });

app.all("*",(req,res,next) => {
    next(new ExpressError(404, "Page not found"))
})

app.use((err,req,res,next) => {
    let { statusCode = 500, message = "Something gone wrong"} = err;
    res.status(statusCode).render("error.ejs", {err})
    // res.status(statusCode).send(message)
    // res.send("Something gone wrong")
})

app.listen(8080, () => {
    console.log("server is listening to port 8080")
})