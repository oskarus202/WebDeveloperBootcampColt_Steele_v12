var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/");
//requiring folder is ok - no need of pointing index.js - as by default this file will be required - (if has name index.js) 

//Index - show all campgrounds
router.get("/", function(req, res){
	//get all campgrounds from Batabase
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, page: 'campgrounds'});
		}
	})
	
});

router.post("/", middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image; 
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, description: desc, author: author};
	//create a new campground and save it to db
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){  
			console.log(err);
		}else{
			//redirect to campgrounds page
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});	
});
//this need to be declared before  /:id route
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("campgrounds/new");
});


//SHOW - shows more info about one campground
router.get("/:id", function(req, res){
	//find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		}else{
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
	
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	// is user logged in?
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
		});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	//redirect somewhere (show page - so the user can see updated campground) 
});


//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;