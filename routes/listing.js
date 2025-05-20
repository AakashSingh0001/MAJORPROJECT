const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js")
const ExpressError = require("../utils/ExpressError.js")
const {listingSchema} = require("../schema.js")


const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body)
        if(error) {
            let errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, error)
        } else {
            next()
        }
}


// 03 New Route
router.get("/new",  (req,res) => {
    if(!req.isAuthenticated) {
        req.flash("error", "You must be logged in to create listing!")
        res.redirect("/listings")
    }
    res.render("listings/new.ejs")
  }) 

//01 Index Route
router.get("/",  async (req,res) => {
   const allListing = await Listing.find({})
   res.render("./listings/index.ejs" , {allListing})
});


//02 Show(read) Route
router.get("/:id", wrapAsync( async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing you requested for does't exist!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing})
}));

//04 Create route
router.post("/",validateListing , wrapAsync(async (req,res,next) => {
    // // let {title, description, image, price, country, location} = req.body;
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing ")
    // }
       
        let listing = req.body.listing;
        const newListing = new Listing(listing)
        await newListing.save();
        req.flash("success" , "New listing created")
        res.redirect("/listings");
})
);

//05 Edit Route
router.get("/:id/edit", wrapAsync( async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does't exist!")
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", {listing})
}));


//06 Update Route
router.put("/:id" , validateListing, wrapAsync( async (req,res) => {
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing ")
    // }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated")
    res.redirect("/listings")   
    // res.redirect(`/listings/${id}`)

}))


//07 Delete route
router.delete("/:id", wrapAsync( async(req,res) => {
    let {id} = req.params;
    let deletedListing  = await Listing.findByIdAndDelete(id);;
    console.log(deletedListing);
    req.flash("success", "Listing Successfully Deleted")
    res.redirect("/listings")

}));

module.exports = router;