import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import Note from "../models/notes.model.js";
import uploadToCloudinary from "../config/cloudinary.js";
import cloudinary from "cloudinary";

const addNotes = asyncHandler(async(req, res) => {
    const { title, description, subjectId, departmentId } = req.body;
    if (!title || !subjectId || !departmentId) {
        throw new apiError(400, "Title, subjectId, departmentId are required..");
    }

    const noteLocalPath = req.file?.path;
    if (!noteLocalPath) {
        throw new apiError(400, "Note file path is required..")
    }

    const note = await uploadToCloudinary(noteLocalPath);
    if (!note) {
        throw new apiError(400, "Note is required..");
    }

    const notes = await Note.create({
        title,
        description,
        noteUrl: note.secure_url,
        notePublic_id: note.public_id,
        subjectId,
        departmentId
    });

    return res.status(201).json(
        new apiResponse(201, notes, "Notes added successfully..")
    )
});

const getAllNotes = asyncHandler(async(req, res) => {
    const { subjectId, departmentId } = req.body;
    
    const filter = {}
    if(subjectId) filter.subjectId = subjectId;
    if(departmentId) filter.departmentId = departmentId;

    const notes = await Note.find(filter)
    .populate("department", "name year")
    .populate("subject", "name")
    .populate("uploadedBy", "name email role")

    if (!notes) {
        throw new apiError(404, "No notes found..");
    }

    return res.status(200).json(
        new apiError(200, notes, "All notes are fetched successfully..")
    )
});

const getNotesById = asyncHandler(async(req, res) => {
    const {noteId} = req.params;
    if (!noteId) {
        throw new apiError(400, "Note id is required..");
    }

    const notes = await Note.findById(noteId)
    .populate("department", "name year")
    .populate("subject", "name")
    .populate("uploadedBy", "name email role")

    if (!notes) {
        throw new apiError(404, "No notes found..");
    }

    return res.status(200).json(
        new apiResponse(200, notes, "Fetched notes successfully..")
    )
});

const updateNotes = asyncHandler(async(req, res) => {
    const {newTitle, newDescription, newSubjectId, newDepartmentId } = req.body;
    const { noteId } = req.params;

    const notes = await Note.findById(noteId)
    .populate("department", "name year")
    .populate("subject", "name")
    .populate("uploadedBy", "name email role")

    if (!notes) {
        throw new apiError(404, "Notes not found..");
    }

    const noteLocalPath = req.file?.path;
    if (!noteLocalPath) {
        throw new apiError(400, "Note file path is required..");
    }

    if (notes.notePublic_id) {
        try {
            await cloudinary.uploader.destroy(notes.notePublic_id, { resources_type: "auto" });
        } catch (error) {
            throw new apiError(500, "Failed to change note file..", error.message);
        }
    }

    const newNotes = await uploadToCloudinary(noteLocalPath);
    if (!newNotes) {
        throw new apiError(400, "Note is required..");
    }

    const updatedFields = {}
    if(newTitle) updatedFields.title = newTitle;
    if(newDescription) updatedFields.description = newDescription;
    if(newSubjectId) updatedFields.subjectId = newSubjectId;
    if(newDepartmentId) updatedFields.departmentId = newDepartmentId;
    if(newNotes) {
        updatedFields.noteUrl = newNotes.secure_url
        updatedFields.notePublic_id = newNotes.public_id
    };

    const updatedNotes = await Note.findByIdAndUpdate(
        noteId,
        { $set: updatedFields },
        { new: true }
    );

    return res.status(200).json(
        new apiResponse(200, updatedNotes, "Notes are updated successfully..")
    )
});

const deleteNotes = asyncHandler(async(req, res) => {
    const { noteId } = req.params;
    if (!noteId) {
        throw new apiError(400, "note id is required..");
    }

    const notes = await Note.findById(noteId);
    if (!notes) {
        throw new apiError(404, "no notes found..");
    }

    await cloudinary.uploader.destroy(notes.notePublic_id, {resources_type: "auto"});

    await Note.findByIdAndDelete(noteId);

    return res.status(200).json(
        new apiResponse(200, "", "Notes are deleted successfully..")
    )
});

export {
    addNotes,
    getAllNotes,
    getNotesById,
    updateNotes,
    deleteNotes
}