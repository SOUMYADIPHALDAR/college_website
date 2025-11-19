import mongoose from "mongoose";

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    fileUrl: {
        type: String,
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {timestamps: true});

export const Note = mongoose.model("Note", noteSchema);