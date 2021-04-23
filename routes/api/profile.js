const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load validators
const validateProfileInput = require('../../validators/profile');
const validateExperienceInput = require('../../validators/experience');
const validateEducationInput = require('../../validators/education');

//Load User & Profile Models 
const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route    get api/profile/test
//@desc     tests profile route
//@access   public
router.get('/test', (req, res) => { res.json({ msg: "Hello profiles" }) });

//@route    get api/profile
//@desc     get current user profile
//@access   private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile || Object.keys(profiles).length == 0){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

//@route    get api/profile/all
//@desc     Get all profile
//@access   public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles || Object.keys(profiles).length == 0){
                errors.noprofile = 'there are no profiles found';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err => res.status(404).json({ profile : 'There are no profile found' }));
});
 
//@route    get api/profile/handle/:handle
//@desc     Get profile by handle
//@access   public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile){
                errors.noprofile = 'there is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

//@route    get api/profile/user/:user_id
//@desc     Get profile by userID
//@access   public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'there is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json( {profile : 'there is no profile for this user'}));
});

//@route    post api/profile
//@desc     create or edit user profile
//@access   private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body)
    if(!isValid) {
        return res.status(400).json(errors);
    }
    //get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    // console.log(profileFields.user);
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.compnay) profileFields.company = req.body.compnay;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    //Skills - split the skills into array
    if(typeof req.body.skills !== 'undefined'){
        profileFields.skills = req.body.skills.split(',');
    };
    //Social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedIn) profileFields.social.linkedIn = req.body.linkedIn;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(profile){
                //Update
                Profile.findOneAndUpdate(
                    { user : req.user.id}, 
                    { $set: profileFields}, 
                    { new: true}
                ).then(profile => res.json(profile));
            } else {
                //create
                //check if handle exists
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if(profile){
                            errors.handle = 'handle already exists';
                            return res.status(404).json(errors);
                        }
                        //save the profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    })
            }
        })

});

//@route    post api/profile/experience
//@desc     Add experience to user profile
//@access   private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne( { user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate,
                current: req.body.current,
                description: req.body.description
            }

            //Add experience to profile
            profile.experience.unshift(newExp);

            profile.save().then(profile => res.json(profile));
        });
});

//@route    post api/profile/education
//@desc     Add education to user profile
//@access   private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body)
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate,
                current: req.body.current,
                description: req.body.description
            }

            //Add education to profile
            profile.education.unshift(newEdu);

            profile.save().then(profile => res.json(profile));
        });
});

//@route    delete api/profile/experience/:exp_id
//@desc     Delete experience from user profile
//@access   private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            //Get remove index from experience array
            const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

            //Splice out of array
            profile.experience.splice(removeIndex, 1);

            //save
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});

//@route    delete api/profile/education/:edu_id
//@desc     Delete education from user profile
//@access   private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            //Get remove index from experience array
            const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

            //Splice out of array
            profile.education.splice(removeIndex, 1);

            //save
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});

//@route    delete api/profile/:profile_id
//@desc     Delete user profile
//@access   private
router.delete('/:profile_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findById({ _id: req.params.profile_id })
        .then(profile => {
            if(profile){
                Profile.findByIdAndRemove({ _id: req.params.profile_id })
                .then(() => {
                    res.json({ msg: 'Profile has been deleted successfully' });
                });
            } else {
                res.json({ msg: "No profile found for this ID"});
            }
        })
    
});

//@route    delete api/profile
//@desc     Delete user & profile
//@access   private
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res)=> {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(profile) {
                Profile.findOneAndRemove({ user: req.user.id })
                    .then(() => {
                        User.findOneAndRemove({ _id: req.user.id})
                            .then(() => {
                                res.json({ success: true });
                            });
                    });
            } else {
                User.findOne({ _id: req.user.id })
                    .then(user => {
                        if(user){
                            User.findOneAndRemove({ _id: req.user.id})
                                .then(() => {
                                    res.json({ success: true });
                                });
                        } else {
                            res.json({msg: "No profile found for given user ID"});
                        }
                    });                
            }
        })
    
});

module.exports = router;