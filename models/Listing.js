const mongoose = require("mongoose");
const { listingSchema } = require("../schema");
const Schema = mongoose.Schema; 
const Review = require("./review");
const { required } = require("joi");

const ListingSchema = new Schema({
  title: {
    type: String,
    required: false ,
  },

  description: String,

  image: {
    url: String, 
    filename: String,
  },
price: {
  type: Number,
  default: 0
},
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Review" , 
    },
  ] ,
  owner: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" , 
  } , 
  category: {
    type: String , 
    enum: ["mountains" , "camping" , "trending" , "rooms"]

  }
  }); 

ListingSchema.post("findOneAndDelete" , async(listing) => {
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
}); 

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;