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
      logName: 'Windows 10 Chrome',
      os: 'Windows',
      os_version: '10',
      browserName: 'Chrome',
      browser_version: '76.0',
      resolution: '1920x1080',
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
