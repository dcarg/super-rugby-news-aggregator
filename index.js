const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

async function getNewsFeed() {
  try {
    const url = 'https://super.rugby/superrugby/news/'

    const { data } = await axios({
      method: "GET",
      url: url,
    })

    const articles = []
    const keys = ['date', 'title', 'summary']

    const $ = cheerio.load(data)

    $('.media-body', data).each((parentIdx, parentElem) => {
      let keyIndex = 0
      const articleObject = {}

      // Get First 5 Articles
      if (parentIdx <= 4){
        $(parentElem).children().each((childIndex, childElem) => {
          const text = $(childElem).text()

          // Get Article url
          if (childIndex === 1) {
            const urlPrefix = "https://super.rugby"

            const child = childElem.firstChild
            const url = child.attribs.href

            if (url) { articleObject["url"] = urlPrefix + url }
          }

          let unique = true
          const key = keys[keyIndex]

          if (key === 'title'){
            unique = !articles.some(article => {
              article.key === text
            });
          }

          if (unique && text) {
            articleObject[key] = text

            keyIndex++
          }
        })

        articles.push(articleObject)
      }
    })

    console.log('articles = ', articles);
    return articles
  } catch (err) {
    console.error(err);
  }
}

const app = express()

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

app.listen(3000, () => {
  console.log('Running on port 3000');
})