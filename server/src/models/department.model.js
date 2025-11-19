import mongoose  from "mongoose";

const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    departmentName: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    }

}, {timestamps: true});

export const Department = mongoose.model("Department", departmentSchema);