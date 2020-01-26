var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
app.locals.moment = require('moment');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

//requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes			= require("./routes/index");


app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); - I will manually create campgrounds - so removing the old one and creating the new ones are not needed for now
mongoose.connect("mongodb://localhost/yelp_camp_v12");


//Passport configuration
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this will pass req.user to every single route - important as for every header (navbar is on every page in header)
// we want to check if user is logged in or not - because depending on that 
//if user is logged - on a header just Logout button should be visible, if the user is not logged in - just Sign up and Login button should be visible 
//(and no Logout button) 
app.use(function(req, res,next){
	res.locals.currentUser=req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});




app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){
	console.log("The Yelp Camp Server has started!");
});