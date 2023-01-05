import { model, Schema, Types } from 'mongoose';

export type UserI = {
    id: Types.ObjectId;
    name: string;
    email: string;
    passwd: string;
    role: 'user' | 'admin';
    myWishes: Array<Types.ObjectId>;
};

export type ProtoUserI = {
    name?: string;
    email?: string;
    passwd?: string;
    role?: 'user' | 'admin';
    myWishes?: Array<Types.ObjectId>;
};

export const userSchema = new Schema<UserI>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwd: {
        type: String,
        required: true,
    },
    role: String,
    myWishes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Wish',
        },
    ],
});

userSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.passwd;
    },
});

export const User = model<UserI>('User', userSchema, 'users');
