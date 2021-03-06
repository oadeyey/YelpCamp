var express = require("express");

var router = express.Router();
var Campground = require("../models/campground");





router.get("/", function(req,res){
   //Get all campgrounds from DB
   Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       }else{
          res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser:req.user});
       }
   });
   
    
});

router.post("/",isLoggedin,function(req,res){
    
   // get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newCampground = {name:name, image:image, description:description, author:author};
   //Create a new campground and save to DB
   Campground.create(newCampground, function(err, campground){
      if(err){
          console.log(err);
      }else{
           res.redirect("/campgrounds");
      }
   });
});

router.get("/new",isLoggedin, function(req,res){
   res.render("campgrounds/new"); 
});

//SHOW - show more information about one campground
router.get("/:id", function(req,res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //render show template with that campground
            res.render("campgrounds/show", {campground:foundCampground}); 
        }   
    });
    
    
   
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit",function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
             res.render("campgrounds/edit", {campground: foundCampground});
        }
       
    });
   
});

// UPDATE CAMPGROUND ROUTE

router.put("/:id", function(req,res){
   //find and update the correct campground
   
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updatedCampground){
      if(err){
          res.redirect("/campgrounds");
      } else{
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
   //redirect somewhere(show page)
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
      if(err){
          res.redirect("/campgrounds");
      }else{
          res.redirect("/campgrounds");
      } 
   });
});

function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;