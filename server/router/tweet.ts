import express from 'express';
import { body } from 'express-validator';

import * as tweetController from '../controller/tweet';
import { validate } from '../middleware/validator';
import { isAuth, isOwner } from '../middleware/auth';

const router = express.Router();

const validateTweet = [
	body('text').trim().isLength({ min: 3 }).withMessage('text should be at least 3 characters'),
	validate,
];

// GET /tweets
// GET /tweets?username=:username
router.get('/', tweetController.getTweets);

// GET /tweets:id
router.get('/:id', tweetController.getTweet);

// POST /tweets
router.post('/', isAuth, validateTweet, tweetController.postTweet);

// UPDATE /tweets:id
router.put('/:id', isAuth, isOwner, validateTweet, tweetController.updateTweet);

// DELETE /tweets:id
router.delete('/:id', isAuth, isOwner, tweetController.deleteTweet);

export default router;
