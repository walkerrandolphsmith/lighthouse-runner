const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

function run(url, opts, config = null) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then(chrome => {
      opts.port = chrome.port;
      return lighthouse(url, opts, config).then(results => {
        return chrome.kill().then(() => {
          return results.lhr;
        });
      });
    });
}

const opts = {
  chromeFlags: [
    "--allow-insecure-localhost",
    "--headless",
    "--no-sandbox",
    "--disable-extensions",
    "--disable-translate",
    "--disable-default-apps",
    "--no-first-run"
  ]
};

const url = process.env.SUT_URL; //'https://localhost:443';

run(url, opts)
  .then(calculateScores)
  .then(failOnPoorPerformance)
  .catch(handleError);

function calculateScores(results = { categories: [] }) {
  return Object.keys(results.categories).reduce((output, categoryName) => {
    var category = results.categories[categoryName];
    const details = {};
    details[categoryName] = { title: category.title, score: category.score };
    return Object.assign({}, output, details);
  }, {});
}

function failOnPoorPerformance(scores) {
  const stringified = JSON.stringify(scores, null, 2);
  Object.keys(scores).forEach(function(categoryName) {
    const categoryScore = scores[categoryName].score;
    if (categoryScore < 1) {
      console.error(stringified);
      process.exit(1);
    }
  });
  console.log(stringified);
  process.exit(0);
}

function handleError(error) {
  console.log("handled error", error);
}
