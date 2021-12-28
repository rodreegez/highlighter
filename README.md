# Highlighter

Scrape your [Kindle highlights](https://read.amazon.com/notebook) and save them to a file.

## Usage

1. Clone this repo
2. `cp .env{.example,}`
3. Add your Amazon email address and password to `.env`
4. `npm install` (requires [puppeteer](https://github.com/puppeteer/puppeteer))
5. `node index.js`

Your highlights will be saved to a file called `highlights.json` in your current working directory. The whole script can take a while to run.
