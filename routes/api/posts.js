const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../../middlewares/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");
const router = express.Router();

//@Route    POST /api/posts
//@desc     Create a post
//@access   Private
router.post("/", [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {

    //Validating Data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = {
            user: req.user.id,
            text: req.body.text,
            name: user.name,
            avatar: user.avatar
        }
        const newPost = new Post(post);
        const savePost = await newPost.save();
        return res.status(201).json(savePost);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal Server Error');
    }

})

//@Route    GET /api/posts
//@desc     Get all posts
//@access   Private
router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        return res.status(200).json(posts);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Internal Server Error');
    }

})

//@Route    GET /api/posts/:post_id
//@desc     Get a post of a user
//@access   Private
router.get("/:post_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        return res.status(200).json(post);
    } catch (error) {
        console.log(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" });
        }
        return res.status(500).send('Internal Server Error');
    }

})

//@Route    DELETE /api/posts/:post_id
//@desc     Delete a post
//@access   Private
router.delete("/:post_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(404).json({ msg: 'Post does not exist' });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not Authorized' });
        }
        await Post.deleteOne({ _id: req.params.post_id });
        return res.status(200).json({ msg: "Post removed" });
    } catch (error) {
        console.log(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" });
        }
        return res.status(500).send('Internal Server Error');
    }

})

//@Route    PUT /api/posts/like/:post_id
//@desc     Like a post
//@access   Private
router.put("/like/:post_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (post.likes.filter(pos => pos.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already been liked' });
        }
        post.likes.unshift({
            user: req.user.id
        });
        await post.save();
        return res.status(200).json(post);
    } catch (error) {
        console.log(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" });
        }
        return res.status(500).send('Internal Server Error');
    }
})


//@Route    PUT /api/posts/unlike/:post_id
//@desc     Unlike a post
//@access   Private
router.put("/unlike/:post_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        // Check if the post has not yet been liked
        if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'Post has not yet been liked' });
        }
        // remove the like
        post.likes = post.likes.filter(
            ({ user }) => user.toString() !== req.user.id
        );
        await post.save();
        return res.status(200).json(post);
    } catch (error) {
        console.log(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" });
        }
        return res.status(500).send('Internal Server Error');
    }
})

//@Route    PUT /api/posts/comments/:post_id
//@desc     Comment a post
//@access   Private
router.post("/comments/:post_id", [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {

    //Validating data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id);
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res.status(400).json({ msg: 'Post not found' });
        }
        post.comments.unshift({
            user: req.user.id,
            text: req.body.text,
            name: user.name,
            avatar: user.avatar
        });
        await post.save();
        return res.status(200).json(post.comments);
    } catch (error) {
        console.log(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" });
        }
        return res.status(500).send('Internal Server Error');
    }
})

//@Route    DELETE /api/posts/comments/:post_id/:comment_id
//@desc     Delete a comment
//@access   Private
router.delete("/comments/:id/:comment_id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Pull out comment
        const comment = post.comments.find(
            (comment) => comment.id === req.params.comment_id
        );
        // Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }
        // Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        post.comments = post.comments.filter(
            ({ id }) => id !== req.params.comment_id
        );

        await post.save();

        return res.json(post.comments);
    } catch (error) {
        console.log(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not found" });
        }
        return res.status(500).send('Internal Server Error');
    }
})


module.exports = router;