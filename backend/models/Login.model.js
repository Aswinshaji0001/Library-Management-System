import mongoose, { mongo } from "mongoose";

const LoginSchema=new mongoose.Schema({
    username:{type:String},
    password:{type:String},
    email:{type:String},
    accounttype:{type:String}
});
export default mongoose.model.login||mongoose.model("login",LoginSchema);