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

    const newPost = new PostMessage(body);

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

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("No posts with that ID");
    }

    const post = await PostMessage.findById(_id);
    post.likeCount ++;
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, {...post}, {new: true});

    res.json(updatedPost);
}