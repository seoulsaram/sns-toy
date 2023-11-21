import express from 'express';

let tweets = [
  {
    id: 1,
    text: '드림코딩에서 강의 들으면 너무 좋으다',
    createdAt: '2021-05-09T04:20:57.000Z',
    name: 'Bob',
    username: 'bob',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
  },
  {
    id: 2,
    text: '꺄아옹',
    createdAt: '2021-05-09T04:20:57.000Z',
    name: 'Bon',
    username: 'bon',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
  },
];

const router = express.Router();

// GET /tweets
// GET /tweets?username=:username
// 내 코드
// router.get('/', (req, res) => {
//   const username = req.query?.username;
//   if (!username) {
//     res.status(200).send(JSON.stringify(tweets));
//     return;
//   }

//   const userData = tweets.filter((tweet) => tweet.username === username);
//   res.status(200).send(JSON.stringify(userData));
// });

//샘 코드
router.get('/', (req, res) => {
  const username = req.query?.username;
  const data = username
    ? tweets.filter((t) => t.username === username)
    : tweets;
  res.status(200).json(data);
});

// GET /tweets:id
router.get('/:id', (req, res) => {
  const id = req.params?.id;
  const tweet = tweets.find((tweet) => tweet.id === Number(id));
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
});

// POST /tweets
router.post('/', (req, res) => {
  const { text, name, username } = req.body;

  if (!text || !name || !username) {
    res.status(400).json({ message: 'Data format is not valid' });
  } else {
    const tweet = {
      id: Date.now(),
      text,
      createdAt: new Date(),
      name,
      username,
    };
    tweets = [tweet, ...tweets];
    res.status(201).json(tweet);
  }
});

// UPDATE /tweets:id
router.put('/:id', (req, res) => {
  const id = req.params?.id;
  const text = req.body?.text;
  const tweet = tweets.find((tweet) => tweet.id === Number(id));
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
});

// DELETE /tweets:id
router.delete('/:id', (req, res) => {
  const id = req.params?.id;
  const isIdValid = tweets.find((t) => t.id === Number(id));
  if (!isIdValid) {
    res.status(404).json({ message: 'No post found' });
  } else {
    tweets = tweets.filter((t) => t.id !== Number(id));
    res.sendStatus(204);
  }
});

export default router;
