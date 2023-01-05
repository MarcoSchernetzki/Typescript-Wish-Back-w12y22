import { Schema, Types, model } from 'mongoose';

export type WishI = {
    id: Types.ObjectId;
    category: string;
    inspiration: boolean;
    name: string;
    image: string;
    origin: string;
    price: string;
    comments: string;
    comeTrue: boolean;
    owner: Types.ObjectId;
};

export type ProtoWishI = {
    category?: string;
    inspiration?: boolean;
    name?: string;
    image?: string;
    origin?: string;
    price?: string;
    comments?: string;
    comeTrue?: boolean;
    owner?: Types.ObjectId;
};

export const wishSchema = new Schema<WishI>({
    category: String,
    inspiration: false,
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: String,
    origin: String,
    price: String,
    comments: String,
    comeTrue: false,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

wishSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject._id;
    },
});

export const Wish = model<WishI>('Wish', wishSchema, 'wishes');
