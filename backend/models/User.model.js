import mongoose, { mongo } from "mongoose";

const UserSchema=new mongoose.Schema({
    userId:{type:String},
    name:{type:String},
    age:{type:String},
    email:{type:String},
    ph:{type:String}
});
export default mongoose.model.user||mongoose.model("user",UserSchema);