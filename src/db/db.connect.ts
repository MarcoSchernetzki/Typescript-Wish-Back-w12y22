import mongoose from 'mongoose';
import { USER, CLUSTER, PASSW } from '../config.js';

export async function dbConnect() {
    const DBName = process.env.NODE_ENV !== 'test' ? 'Wishes' : 'WishesTesting';
    let uri = `mongodb+srv://${USER}:${PASSW}`;
    uri += `@${CLUSTER}/${DBName}?retryWrites=true&w=majority`;
    return mongoose.connect(uri);
}
