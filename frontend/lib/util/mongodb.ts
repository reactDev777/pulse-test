import mongoose from 'mongoose';

export const connectMongo = async () =>
    mongoose.connect(
        `mongodb+srv://${process.env.NEXT_PUBLIC_DB_USERNAME}:${process.env.NEXT_PUBLIC_DB_PASSWORD}@${process.env.NEXT_PUBLIC_DB_CLUSTER}.mongodb.net/${process.env.NEXT_PUBLIC_DB_NAME_MONGO}?retryWrites=true&w=majority`
    );
