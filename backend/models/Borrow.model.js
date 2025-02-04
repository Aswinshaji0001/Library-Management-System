import mongoose, { mongo } from "mongoose";

const borrowSchema=new mongoose.Schema({
    userId:{type:String},
    title:{type:String},
    author :{type:String},
    copies:{type:Number},
    date:{type:String}
});
export default mongoose.model.borrowed||mongoose.model("borrowed",borrowSchema);