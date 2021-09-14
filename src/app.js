import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';

//@Importing config
import sentryConfig from './config/sentry';
import connectDB from './config/database';

//@Importing routes
import user from './routes/user.routes';
import waitingList from './routes/waitingList.routes';
import lists from './routes/lists.routes';
import joinlist from './routes/joinList.routes';
import referlist from './routes/referList.routes';

connectDB();

class App {
  constructor() {
    this.server = express();
    this.server.use(helmet());
    this.server.use(compression());

    Sentry.init(sentryConfig);

    this.server.enable('trust proxy');
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(express.json());
    // parse application/x-www-form-urlencoded
    this.server.use(bodyParser.urlencoded({ extended: true }));

    // parse application/json
    this.server.use(bodyParser.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    //@Routes

    this.server.use(user, lists, waitingList, joinlist, referlist);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'production') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
