import { logEvents } from './logger.js';

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
    console.log(err.stack);

    const status = res.statusCode && res.statusCode!=200 ? res.statusCode : 500;

    res.status(status).json({ err: err.message });
}

export default errorHandler;