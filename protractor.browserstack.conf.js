const { SpecReporter } = require('jasmine-spec-reporter');
const browserstack = require('browserstack-local');
const fs = require('fs');
const path = require('path');
const useragent = require('useragent');

const commonPropertiesForCapabilities = {
  project: 'Tour of Heroes Browserstack Test',
  'browserstack.local': 'true',
  'browserstack.timezone': 'UTC',
  'browserstack.video': 'true',
  'browserstack.debug': 'false',
  'browserstack.networkLogs': 'false',
  'browserstack.user': 'bsuser123',
  'browserstack.key': 'bskey123'
};

exports.config = {
  allScriptsTimeout: 300000,
  getPageTimeout: 30000,
  specs: ['./e2e/*.e2e-spec.ts'],

  // bs-local.com is a browserstack alias that redirects to the locally hosted instance
  baseUrl: 'http://bs-local.com:4000/',
  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',

  multiCapabilities: [
    {
      logName: 'Windows 10 Chrome',
      os: 'Windows',
      os_version: '10',
      browserName: 'Chrome',
      browser_version: '76.0',
      resolution: '1920x1080',
      ...commonPropertiesForCapabilities
    }
  ],
  // values greater than 2 can lead to connection problems during the tests
  maxSessions: Number(process.env.BROWSERSTACK_SESSION_COUNT || 2),

  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 300000,
    print: function() {}
  },
  SELENIUM_PROMISE_MANAGER: false,

  // beforeAll
  beforeLaunch() {
    return new Promise((resolve, reject) => {
      console.log('Connecting local');
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start(
        {
          key: commonPropertiesForCapabilities['browserstack.key']
        },
        function(error) {
          if (error) return reject(error);
          console.log('Connected. Now testing...');

          resolve();
        }
      );
    });
  },

  // beforeEach capability
  async onPrepare() {
    require('ts-node').register({
      project: __dirname + '/tsconfig.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));

    // statistics export configuration
    const userAgent = useragent.parse(await browser.driver.executeScript('return navigator.userAgent'));
    const parsedUserAgentForFileName = userAgent
      .toString()
      .replace(/\s/g, '_')
      .replace(/\//g, '_')
      .toLowerCase();
    const outFile = `statistics/e2e-bs_${parsedUserAgentForFileName}.json`;
    if (!fs.existsSync(path.dirname(outFile))) {
      fs.mkdirSync(path.dirname(outFile));
    }

    await logSessionIdAndUserAgent();

    return browser.getProcessedConfig().then(config => resizeWindow(config));
  },

  // afterAll
  afterLaunch() {
    return new Promise(resolve => exports.bs_local.stop(resolve));
  }
};

const logSessionIdAndUserAgent = async function() {
  const sessionId = await browser.getSession().then(session => session.getId());
  const userAgent = useragent.parse(await browser.driver.executeScript('return navigator.userAgent'));
  console.log(`Browserstack session is running on ${userAgent} with id ${sessionId}`);
};

const resizeWindow = async function(config) {
  const isDesktop = config.capabilities.os === 'Windows' || config.capabilities.os === 'OS X';
  if (isDesktop === true) {
    await browser.driver
      .manage()
      .window()
      .maximize();
    console.log('Maximized window');
    browser.switchTo();
  }
};
