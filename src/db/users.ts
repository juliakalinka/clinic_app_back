import mongoose from "mongoose";

const AvailableDateSchema = new mongoose.Schema({
    available_date: {type: Date}
});

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    role: {type: String, required: true, default: "user"},
    authentication: {
        password: {type: String, required: true, select: false},
        salt: {type: String, select: false},
        sessionToken: {type: String, select: false},
    },
    sex: {type: String, required: true, default: "man"},
    work: {type: String, required: true, default: "none"},
    availability: [AvailableDateSchema]
});
export const allowedRoles = ['doctor', 'user', 'admin'];

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({email});
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({"authentication.sessionToken": sessionToken});
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (user: Record<string, any>) => new UserModel(user).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete({_id: id});
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);

export const addAvailableDate = (id: string, date: Date) => UserModel.findByIdAndUpdate(id, {$push: {availability: {available_date: date}}});

export const getUserByName = (username: string) => {

    const regex = new RegExp(username, 'i');


    return UserModel.find({username: regex, role: "doctor"});
};
