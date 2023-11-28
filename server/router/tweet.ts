import express from 'express';
import { body } from 'express-validator';

import * as tweetController from '../controller/tweet';
import { validate } from '../middleware/validator';

const router = express.Router();

const validateTweet = [
  body('text')
    .trim()
    .isLength({ min: 3 })
    .withMessage('text should be at least 3 characters'),
  validate,
];

// GET /tweets
// GET /tweets?username=:username
router.get('/', tweetController.getTweets);

// GET /tweets:id
router.get('/:id', tweetController.getTweet);

// POST /tweets
router.post('/', validateTweet, tweetController.postTweet);

// UPDATE /tweets:id
router.put('/:id', validateTweet, tweetController.updateTweet);

// DELETE /tweets:id
router.delete('/:id', tweetController.deleteTweet);

export default router;
