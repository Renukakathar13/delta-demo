const express = require("express"); 
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/Listing");
const {isLoggedIn , isOwner , validateListing } = require("../middleware"); 
const listingController = require("../controllers/listing");
const multer  = require('multer')
const {storage} = require("../CloudConfig");
const upload = multer({ storage });

router
.route("/")
.get( wrapAsync (listingController.index))
.post(
isLoggedIn ,
upload.single("listing[image][url]"),
wrapAsync(listingController.createListing)
);

// 🔍 Filter route (ADD HERE)
router.get("/category/:category", async (req, res, next) => {
  try {
    const { category } = req.params;
    const listings = await Listing.find({ category });

    res.render("listings/index", { allListings: listings });
  } catch (err) {
    next(err);
  }
});


//New Route 
router.get("/new" , isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
.get(
     wrapAsync(listingController.showListing)
    )
.put( 
    isLoggedIn, 
    isOwner ,
    upload.single("listing[image][url]"), 
    wrapAsync(listingController.updateListing)
)
.delete(
     isLoggedIn, 
     isOwner ,
     wrapAsync(listingController.destroyListing)
    );

//Edit route 
router.get("/:id/edit",
     isLoggedIn,
     isOwner , 
     wrapAsync(listingController.renderEditForm)
    );

module.exports = router;