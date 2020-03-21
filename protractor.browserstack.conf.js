const { SpecReporter } = require('jasmine-spec-reporter');
const browserstack = require('browserstack-local');

const browserstackCapabilities = {
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
  specs: ['./e2e/specs/*.e2e-spec.ts'],
  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
  maxSessions: Number(process.env.BROWSERSTACK_SESSION_COUNT || 2),

  multiCapabilities: [
    {
      logName: 'Windows 10 Firefox',
      os: 'Windows',
      os_version: '10',
      browserName: 'Firefox',
      browser_version: '74.0',
      'browserstack.selenium_version': '3.10.0',
      ...browserstackCapabilities
    },
    {
      logName: 'OSX Safari',
      os: 'OS X',
      os_version: 'High Sierra',
      browserName: 'Safari',
      browser_version: '11.0',
      ...browserstackCapabilities
    },
    {
      logName: 'Galaxy Note 10 Chrome',
      os_version: '9.0',
      device: 'Samsung Galaxy Note 10',
      browserName: 'Chrome',
      real_mobile: 'true',
      ...browserstackCapabilities
    },
    {
      logName: 'iPhone X Safari',
      device: 'iPhone X',
      os_version: '11',
      browserName: 'Safari',
      real_mobile: 'true',
      ...browserstackCapabilities
    }
  ],

  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },

  beforeLaunch() {
    return new Promise((resolve, reject) => {
      console.log('Connecting local');
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start(
        {
          key: browserstackCapabilities['browserstack.key']
        },
        function(error) {
          if (error) return reject(error);
          console.log('Connected. Now testing...');
          resolve();
        }
      );
    });
  },

  async onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));

    return browser.getProcessedConfig();
  },

  afterLaunch() {
    return new Promise(resolve => exports.bs_local.stop(resolve));
  }
};
