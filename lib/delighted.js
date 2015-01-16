var merge = require('./utils/merge');

var DEFAULT_HOST    = 'api.delighted.com';
var DEFAULT_PORT    = 443;
var DEFAULT_BASE    = '/v1';
var DEFAULT_HEADERS = {
  'Accept':       'application/json',
  'Content-Type': 'application/json',
  'User-Agent':   'Delighted Node Client'
};

var resources = {
  'metrics':        require('./Metrics'),
  'person':         require('./Person'),
  'surveyRequest':  require('./SurveyRequest'),
  'surveyResponse': require('./SurveyResponse'),
  'unsubscribe':    require('./Unsubscribe')
};

function Delighted(key, options) {
  options = (options || {});

  this.config = {
    host:    options.host    || DEFAULT_HOST,
    port:    options.port    || DEFAULT_PORT,
    base:    options.base    || DEFAULT_BASE,
    headers: options.headers || DEFAULT_HEADERS,
    scheme: 'https'
  };

  this._injectAuthorization(key, this.config.headers);
  this._defineResources();
};

merge(Delighted.prototype, {
  _injectAuthorization: function(key, headers) {
    var base64Encoded = new Buffer(key + ':').toString('base64')

    headers['Authorization'] = 'Basic ' + base64Encoded;
  },

  _defineResources: function() {
    for (var name in resources) {
      var Constructor = resources[name];
      this[name] = new Constructor(this.config);
    }
  }
});

module.exports = function(key) {
  return new Delighted(key);
}