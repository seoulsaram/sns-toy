import * as tweetRepository from '../data/tweet.js';

export async function getTweets(req, res) {
  const username = req.query?.username;
  const data = await (username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll());
  res.status(200).json(data);
}

export async function getTweet(req, res) {
  const id = req.params?.id;
  const tweet = await tweetRepository.getById(id);
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
}

export async function postTweet(req, res) {
  const { text, name, username } = req.body;

  if (!text || !name || !username) {
    res.status(400).json({ message: 'Data format is not valid' });
  } else {
    const tweet = await tweetRepository.create(text, name, username);
    res.status(201).json(tweet);
  }
}

export async function updateTweet(req, res) {
  const id = req.params?.id;
  const text = req.body?.text;
  const tweet = await tweetRepository.update(id, text);
  if (!tweet) {
    res.status(404).json({ message: 'No post found' });
    return;
  }
  if (!text) {
    res.status(400).json({ message: 'Data format is not valid' });
    return;
  }

  tweet.text = text;
  res.status(200).json(tweet);
}

export async function deleteTweet(req, res) {
  const id = req.params?.id;
  const allContent = await tweetRepository.getAll();
  const isIdValid = allContent.find((t) => t.id === Number(id));
  if (!isIdValid) {
    res.status(404).json({ message: 'No post found' });
  } else {
    await tweetRepository.remove(id);
    res.sendStatus(204);
  }
}
