import compression from 'compression';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import api from './api';
import { addNotifier, getEvents, getSensor } from './data';
import Notifier from './notifier';

const PORT = process.env.PORT || 8102;

const notifier = new Notifier();

addNotifier(
  'event',
  (event) => {
    // this can be invoked multiple times as new requests happen
    notifier.test((request) => {
      // we should skip notify if the id of the event does not match the payload
      if (request.path === '/api/sensor/:id' && request.params.id !== event.id) {
        return false;
      }
      return true;
    });
  }
);

notifier.use('/api/event', () => getEvents());
notifier.use('/api/sensor/:id', param => (
  getSensor(param.id).then((result) => {
    if (!result.sensor) {
      return Promise.reject({ statusCode: 404, message: 'Not Found' });
    }
    return Promise.resolve(result);
  })
));

const app = express()
  .use(compression())
  .use(cookieParser())
  .use(morgan('tiny'))
  .use(bodyParser.json());

// REST API
app.use('/api', api);

// UI
app.use('/', express.static(path.join(__dirname, '/../dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, '/../dist/index.html')));
});

const server = http.createServer(app);
server.listen(PORT);
notifier.listen(server);

console.log(`Server started at port ${PORT}`);
