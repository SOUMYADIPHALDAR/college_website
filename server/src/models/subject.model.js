import mongoose from "mongoose";

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    subjectName: {
        type: String,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true
    }

}, {timestamps: true});

export const Subject = mongoose.model("Subject", subjectSchema);