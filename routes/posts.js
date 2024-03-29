import express, { Router } from 'express';

import { getPosts, createPost, updatePost, deletePost, likePost } from '../controllers/posts.js';

//Middleware
import auth from '../middleware/auth.js';

//http://localhost:5000/posts
const router = express.Router();
router.get("/", getPosts);
router.post("/", auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);

export default router;