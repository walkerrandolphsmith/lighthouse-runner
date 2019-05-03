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

run(process.env.SUT_URL, opts)
  .then(verbosePrintSideEffect)
  .then(calculateScores)
  .then(failOnPoorPerformance)
  .catch(handleError);

function verbosePrintSideEffect(results = { categories: [] }) {
  if (process.env.VERBOSE) {
    log(results.categories);
  }
  return results.categories;
}

function calculateScores(categories) {
  return Object.keys(categories).reduce((output, categoryName) => {
    var category = categories[categoryName];
    const details = {};
    details[categoryName] = { title: category.title, score: category.score };
    return Object.assign({}, output, details);
  }, {});
}

function log(...args) {
  if (process.env.SILENT) {
    return;
  }
  console.log(...args);
}

function failOnPoorPerformance(scores) {
  const stringified = JSON.stringify(scores, null, 2);
  Object.keys(scores).forEach(function(categoryName) {
    const categoryScore = scores[categoryName].score;
    if (categoryScore < 1) {
      log(stringified);
      process.exit(1);
    }
  });
  log(stringified);
  process.exit(0);
}

function handleError(error) {
  log("Unexpected Error: ", error);
  process.exit(1);
}
