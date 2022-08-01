import app from './app.js'

// NewsFeeds
import superRugbyNewsFeed from './NewsFeeds/superRugby.js'

async function getNewsFeed() {
  const feeds = []

  const superRugbyNewsFeed = superRugbyNewsFeed()

  feeds.push(superRugbyNewsFeed)

  return feeds
}

app.get('/api/super-rugby-news-aggregator', async (request, result) => {
  try {
    const newsFeed = await getNewsFeed()

    return result.status(200).json({
      result: newsFeed,
    })
  } catch (error) {
    return result.status(500).json({
      error: error.toString(),
    })
  }
})

app.get('/favicon.ico', (req, res) => {
  res.sendFile("myfavicon.ico");
});

app.listen(3000, () => {
  console.log('Running on port 3000');
})