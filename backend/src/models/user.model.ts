import { Document, model, Schema } from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose'

// An interface representing the structure of a user
export interface IUser extends Document {
    email: string;
}

// mongoose schema for a user
const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, {
    timestamps: true,
});

// Tell the schema to use the passport local mongoose authentication strategy
// By default username is used to login, but here we want to use an email instead
UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export const User = model<IUser>('User', UserSchema);