import mongoose from 'mongoose';

import { DB_URI } from './env-config.js';

const connect = async () => {
    await mongoose.connect(DB_URI);
}

export default connect;