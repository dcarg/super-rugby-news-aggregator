import cheerio from 'cheerio'

import api from '../api.js'

async function superRugbyNewsFeed(){
  try {
    const url = 'https://super.rugby/superrugby/news/'

    const { data } = await api(url)

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

export default superRugbyNewsFeed