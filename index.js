require('dotenv').config()
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://read.amazon.com/notebook')
  await page.waitForSelector('#ap_email')
  await page.type('#ap_email', process.env.EMAIL)
  await page.type('#ap_password', process.env.PASSWORD)
  await Promise.all([
    page.click('#signInSubmit'),
    page.waitForNavigation(),
  ])

  let books = []
  let links = await page.$$('#kp-notebook-library > div > span > a')
  let currentIndex = 1

  while(currentIndex < links.length) {
    console.log(`about to click link ${currentIndex}`)

    await Promise.all([
      page.click(`div#kp-notebook-library > div:nth-child(${currentIndex})`),
      page.waitForTimeout(3000)
    ])

    console.log(`clicked link ${currentIndex}`)

  	let author = await page.$eval('div.a-span5 > p.a-spacing-none.kp-notebook-metadata', text => text.textContent);
  	let title = await page.$eval('h3', text => text.textContent);
  	let highlights = await page.$$('#highlight')

    for(let highlight of highlights) {
      let quote = await highlight.evaluate((node) => node.innerText)
      let book = {
        'author': author,
        'title': title,
        'highlight': quote
      }
      console.log(book)
      books.push(book)
    }

    console.log(`about to go back`)

    await page.goto('https://read.amazon.com/notebook')

    console.log(`back`)

    currentIndex ++
  }

	console.log(books)

  await page.screenshot({ path: 'screenshot.png' })

  await browser.close()

  fs.writeFileSync('highlights.json', JSON.stringify(books, null, 2))
})()
