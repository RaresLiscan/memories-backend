import PostMessage from "../models/postMessage.js";
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();

        res.status(200).json(postMessages);
    }
    catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const createPost = async (req, res) => {
    const body = req.body;

    const newPost = new PostMessage({ ...body, creator: req.userId, createdAt: new Date().toISOString() });

    try {
        await newPost.save();

        res.status(200).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const {id: _id} = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("No posts with that ID");
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, { new: true });
    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const {id: _id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("No posts with that ID");
    }

    await PostMessage.findByIdAndRemove(_id);

    return res.json({ message: "Post deleted succesfully" });
}

export const likePost = async (req, res) => {
    const {id: _id} = req.params;

    if (!req.userId) {
        return res.json({message: "Unauthenticated"});
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("No posts with that ID");
    }

    const post = await PostMessage.findById(_id);
    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        //like the post
        post.likes.push(req.userId);
    }
    else {
        // dislike a post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post}, {new: true});

    res.json(updatedPost);
}