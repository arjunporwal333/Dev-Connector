const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

//@Route    GET /api/profile/me
//@desc     Get Current User Profile
//@access   Private
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(404).json({ msg: "There is no profile for this user" });
        }

        return res.status(200).json(profile);

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal Server Error");
    }
})

//@Route    POST /api/profile
//@desc     Create or Update User Profile
//@access   Private
router.post("/", [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
]], async (req, res) => {

    //Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
    } = req.body;

    //Build Profile Object
    let profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(",").map(skill => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            //Update if Profile already exists
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true });
            return res.status(202).json(profile);
        }

        let newProfile = new Profile(profileFields);
        let saveProfile = await newProfile.save();
        return res.status(201).json(saveProfile);

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal Server Error");
    }
})

//@Route    GET /api/profile
//@desc     Get all profiles
//@access   Public
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.status(200).json(profiles);
    } catch (error) {
        console.log(error.msg);
        return res.status(500).send("Internal Server Error");
    }
})

//@Route    GET /api/profile/:user_id
//@desc     Get a profile by UserId
//@access   Public
router.get("/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: "Profile not found" });
        }
        return res.status(200).json(profile);
    } catch (error) {
        console.log(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: "Profile not found" });
        }
        return res.status(500).send("Internal Server Error");
    }
})

//@Route    DELETE /api/profile
//@desc     Delete my profile
//@access   Private
router.delete("/", auth, async (req, res) => {
    try {
        //Remove Posts

        //Remove Profile
        await Profile.deleteOne({ user: req.user.id });

        //Remove User account
        await User.deleteOne({ _id: req.user.id });

        return res.status(200).json({ msg: "User Removed" });
    } catch (error) {
        console.log(error.msg);
        return res.status(500).send("Internal Server Error");
    }
})


//@Route    PUT /api/profile/experience
//@desc     Add experince in profile
//@access   Private
router.put("/experience", [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {

    //Validate Data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        description,
        from,
        to,
        current,
        location
    } = req.body;

    const newExp = {
        title,
        company,
        description,
        from,
        to,
        current,
        location
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(newExp);
        await profile.save();
        return res.status(202).json(profile);
    } catch (error) {
        console.log(error.msg);
        return res.status(500).send("Internal Server Error");
    }
})

//@Route    PATCH /api/profile/experience/:exp_id
//@desc     Update experince in profile
//@access   Private
router.patch("/experience/:exp_id", [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {

    //Validate Data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        description,
        from,
        to,
        current,
        location
    } = req.body;

    const newExp = {
        _id: req.params.exp_id,
        title,
        company,
        description,
        from,
        to,
        current,
        location
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const index = profile.experience.map(exp => exp._id).indexOf(req.params.exp_id);
        profile.experience[index] = newExp;
        await profile.save();
        return res.status(202).json(profile);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

//@Route    DELETE /api/profile/experience/:exp_id
//@desc     Delete experince from profile
//@access   Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const matchedProfile = profile.experience.map(prof => prof._id).indexOf(req.params.exp_id);
        profile.experience.splice(matchedProfile, 1);
        await profile.save();
        return res.status(200).json(profile);
    } catch (error) {
        console.log(error.msg);
        return res.status(500).send("Internal Server Error");
    }
})

//@Route    PUT /api/profile/education
//@desc     Add ducation in profile
//@access   Private
router.put("/education", [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {

    //Validate Data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(newExp);
        await profile.save();
        return res.status(202).json(profile);
    } catch (error) {
        console.log(error.msg);
        return res.status(500).send("Internal Server Error");
    }
})

//@Route    PATCH /api/profile/education/:edu_id
//@desc     Update ducation in profile
//@access   Private
router.patch("/education/:edu_id", [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {

    //Validate Data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        _id: req.params.edu_id,
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const index = profile.education.map(edu => edu._id).indexOf(req.params.edu_id);
        profile.education[index] = newEdu;
        await profile.save();
        return res.status(202).json(profile);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})

//@Route    DELETE /api/profile/education/:edu_id
//@desc     Delete Education from profile
//@access   Private
router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const matchedProfile = profile.education.map(prof => prof._id).indexOf(req.params.edu_id);
        profile.education.splice(matchedProfile, 1);
        await profile.save();
        return res.status(200).json(profile);
    } catch (error) {
        console.log(error.msg);
        return res.status(500).send("Internal Server Error");
    }
})

//@Route    GET /api/profile/github/:username
//@desc     Get github repos of a user
//@access   Public
router.get("/github/:username", async (req, res) => {
    try {
        const optionss = {
            uri: `https://api.github.com/users/${req.params.username}/repos?perpage=5&sort=created:asc&client_id=${config.get("githubclientid")}&client_secret=${config.get("githubclientsecret")}`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js'
            }
        }
        request(optionss, (err, response, body) => {
            if (err) console.error(err);
            if (response.statusCode != 200) {
                return res.status(404).json({ msg: "No github profile found" });
            }
            return res.status(200).json(JSON.parse(body))
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})


module.exports = router;