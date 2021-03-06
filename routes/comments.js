var express = require("express");

var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//Displays form for entering new comments
router.get("/new",isLoggedin,function(req,res){
    // find campground by id
    
    Campground.findById(req.params.id,function(err,newCampground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:newCampground});
        }
    });
});

router.post("/",isLoggedin,function(req,res){
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }else {
         
           Comment.create(req.body.comment,function(err, comment){
              if(err){
                 console.log(err); 
              }else{
                  //add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save comments
                  comment.save();
                  
                  
                    campground.comments.push(comment);
                   campground.save();
                   console.log(comment);
                   res.redirect("/campgrounds/" + campground._id);
                } 
            });
          
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