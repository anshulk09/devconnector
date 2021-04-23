const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load user and Post Models
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//Validation
const validatePostInput = require('../../validators/post');

//@route      GET api/posts/test
//@desc       Tests post route
//@access     Public
router.get('/test', (req, res) => { res.json({ msg: "Hello posts" }) });

//@route      GET api/posts/
//@desc       Get all posts for all users
//@access     Public
router.get('/', (req, res) => {
    const errors = {};
    Post.find()
        .sort({date: -1})
        .populate('user', ['name', 'avatar'])
        .then(posts => {
            if(!posts || Object.keys(posts).length == 0){
                errors.noPost = "There is no post for any user";
                return res.status(404).json(errors);
            } else {
                return res.json(posts);
            }
        })
});

//@route      GET api/posts/:id
//@desc       Get all posts for all users
//@access     Public
router.get('/:id', (req, res) => {
    const errors = {};
    Post.findById(req.params.id)
        .sort({date: -1})
        .populate('user', ['name', 'avatar'])
        .then(posts => {
            if(!posts || Object.keys(posts).length == 0){
                errors.noPost = "No post found with this ID";
                return res.status(404).json(errors);
            } else {
                return res.json(posts);
            }
        })
});

//@route      Post api/posts/
//@desc       Create
//@access     Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
    }).save().then(post => res.json(post));
});

//@route      DELETE api/posts/:id
//@desc       delete post
//@access     Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
   // Profile.findOne({ user: req.user.id })
     //   .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //check for post owner
                    if(post.user.toString() !== req.user.id){
                        return res.status(401).json({ noauthorization : "You are not authorized to do this"});
                    }
                    //delete the post
                    post.remove().then(() => res.json({message : "Deleted successfully"}));
                })
                .catch(err => res.status(404).json({ NoPostFound : "No post found"}));
       // })
});

//@route      Post api/posts/likes/:id
//@desc       Like post
//@access     Private
router.post('/likes/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
   // Profile.findOne({ user: req.user.id })
     //   .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0 ){
                        return res.status(400).json({ alreadyLiked : "User already liked this post" });
                    }

                    //Add the user ID to likes array
                    post.likes.unshift({ user: req.user.id });

                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ NoPostFound : "No post found"}));
       // })
});

//@route      Post api/posts/unlikes/:id
//@desc       unLike post
//@access     Private
router.post('/unlikes/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  //  Profile.findOne({ user: req.user.id })
      //  .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0 ){
                        return res.status(400).json({ notLiked : "User has not yet liked this post" });
                    }

                    //Get the remove index
                    const removeIndex = post.likes.map(like=> like.user.toString()).indexOf(req.user.id);

                    //splice out of Array
                    post.likes.splice(removeIndex, 1);

                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ NoPostFound : "No post found"}));
      //  })
});

//@route      Post api/posts/comment/:id
//@desc       Add comment to a post
//@access     Private
router.post('/comments/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }
    // Profile.findOne({ user: req.user.id })
      //   .then(profile => {
             Post.findById(req.params.id)
                 .then(post => {
                     const newComment = {
                         text: req.body.text,
                         name: req.body.name,
                         avatar: req.body.avatar,
                         user: req.user.id
                     }
 
                     //Add to comments array
                     post.comments.unshift(newComment);
 
                     post.save().then(post => res.json(post));
                 })
                 .catch(err => res.status(404).json({ NoPostFound : "No post found"}));
        // })
 });


 //@route      Post api/posts/comment/:id/:commentID
 //@desc       Remove comment from a post
 //@access     Private   
 router.post('/comments/:id/:commentID', passport.authenticate('jwt', { session: false }), (req, res) => {
      // Profile.findOne({ user: req.user.id })
      //   .then(profile => {
             Post.findById(req.params.id)
                 .then(post => {
                     //check to see if comments exist
                     if(post.comments.filter(comment => comment._id.toString() === req.params.commentID).length === 0){
                         return res.status(404).json({ commentnotexists: "comment does not exists"});
                     }
                     //get remove index
                     const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.commentID);
                     //Add to comments array
                     post.comments.splice(removeIndex, 1);
 
                     post.save().then(post => res.json(post));
                 })
                 .catch(err => res.status(404).json({ NoPostFound : "No post found"}));
        // })
 });

module.exports = router;