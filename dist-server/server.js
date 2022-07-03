'use strict';

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _data = require('./data');

var _notifier = require('./notifier');

var _notifier2 = _interopRequireDefault(_notifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 8102;

var notifier = new _notifier2.default();

(0, _data.addNotifier)('event', function (event) {
  // this can be invoked multiple times as new requests happen
  notifier.test(function (request) {
    // we should skip notify if the id of the event does not match the payload
    if (request.path === '/api/sensor/:id' && request.params.id !== event.id) {
      return false;
    }
    return true;
  });
});

notifier.use('/api/events', function () {
  return (0, _data.getEvents)();
});
notifier.use('/api/sensors', function () {
  return (0, _data.getSensors)();
});
notifier.use('/api/sensor/:id', function (param) {
  return (0, _data.getSensor)(param.id).then(function (result) {
    if (!result.sensor) {
      return Promise.reject({ statusCode: 404, message: 'Not Found' });
    }
    return Promise.resolve(result);
  });
});

var app = (0, _express2.default)().use((0, _compression2.default)()).use((0, _cookieParser2.default)()).use((0, _morgan2.default)('tiny')).use(_bodyParser2.default.json());

// REST API
app.use('/api', _api2.default);

// UI
app.use('/', _express2.default.static(_path2.default.join(__dirname, '/../dist')));
app.get('/*', function (req, res) {
  res.sendFile(_path2.default.resolve(_path2.default.join(__dirname, '/../dist/index.html')));
});

var server = _http2.default.createServer(app);
server.listen(PORT);
notifier.listen(server);

console.log('Server started at port ' + PORT);
//# sourceMappingURL=server.js.map