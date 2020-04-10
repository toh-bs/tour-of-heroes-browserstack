import { browser } from 'protractor';
import { existsSync, mkdirSync } from 'fs';
const fs = require('fs');

export async function takeScreenshot(testName) {
  await browser.takeScreenshot().then(function (png) {
    writeScreenShot(png, testName);
  });
}

async function writeScreenShot(data, filename) {
  const screenshotDir = `${__dirname}/../screenshots/`;
  const fullFileName = filename + (await getCapabilityName()) + '.png';
  createDirectoryIfNotExistent(screenshotDir);
  const stream = fs.createWriteStream(screenshotDir + fullFileName);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

function createDirectoryIfNotExistent(directory) {
  if (!existsSync(directory)) {
    mkdirSync(directory);
  }
}

function getCapabilityName() {
  return browser.getCapabilities().then(capabilities => '_' + capabilities.get('platformName') + '_' + capabilities.get('browserName'));
}
