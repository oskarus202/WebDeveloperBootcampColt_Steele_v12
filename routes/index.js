var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//root route
router.get("/", function(req, res){
	res.render("landing"); 
});



//=================
//Auth Routes

//show register form
router.get("/register", function(req, res){
	res.render("register", {page: 'register'});
});

//handles sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	if(req.body.adminCode === 'secretQA123'){
		newUser.isAdmin = true; 
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register", {err: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp "+ user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login", {page: 'login'});
});

//handling logic for login
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req,res){
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You have been logged out.");
	res.redirect("/campgrounds");
});




module.exports = router;