import mongoose, { mongo } from "mongoose";

const bookSchema=new mongoose.Schema({
    title:{type:String},
    author :{type:String},
    cover:{type:String},
    isbn:{type:Number},
    year:{type:String},
    copies:{type:Number},
});
export default mongoose.model.book||mongoose.model("books",bookSchema);