'use strict';

import { dbConnection, logger } from 'lib-common-service';
import app from './app.js';
import dotenv from 'dotenv';

dotenv.config({
    path: './env'
});

const log = logger('db-connection');

dbConnection()
.then(() => {
    const port = process.env.PORT || 4800;
    app.listen(port, () => {
        log.info(`Server is running on PORT: ${port}`);
    });
}).catch((err) => {
    log.error('DB Connection Failed! ', err);
});