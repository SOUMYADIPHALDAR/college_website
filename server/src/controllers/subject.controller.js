import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { Subject } from "../models/subject.model";

const createSubject = asyncHandler(async(req, res) => {
    const { subjectName, departmentId } = req.body;

    if (!subjectName || !departmentId) {
        throw new apiError(400, "Subject name and department id is required..");
    }

    const existing = await Subject.findOne(
        { subjectName },
        null,
        { collation: { locale: "en", strength: 2 }}
    )
    if (existing) {
        throw new apiError(400, "this subject already exists..");
    }

    const subject = await Subject.create({
        subjectName,
        department: departmentId
    });

    return res.status(201).json(
        new apiResponse(201, subject, "Subject created successfully..")
    )
});

const getSubjectByDepartment = asyncHandler(async(req, res) => {
    const { departmentId } = req.body;

    if (!departmentId) {
        throw new apiError(400, "department id is required..");
    }

    const subjects = await Subject.find({ department: departmentId });
    if (!subjects || subjects.length === 0) {
        throw new apiError(404, "Subjects not found..");
    }

    return res.status(200).json(
        new apiResponse(200, subjects, "Subjects are fetched successfully..")
    )
});

const getSubjectById = asyncHandler(async(req, res) => {
    const { subjectId } = req.body;

    if (!subjectId) {
        throw new apiError(400, "subject id is required..");
    }

    const subject = await Subject.findById(subjectId);

    if (!subject) {
        throw new apiError(404, "Subject not found..");
    }

    return res.status(200).json(
        new apiResponse(200, subject, "Subject fetched successfully...")
    )
});

const updateSubject = asyncHandler(async(req, res) => {
    const { subjectId } = req.params;
    const { newSubjectName, newDepartmentId } = req.body;

    if (!subjectId) {
        throw new apiError(400, "subject id is required..");
    }

    const subject = await findById(subjectId).populate("department");
    if (!subject) {
        throw new apiError(400, "no subject found..")
    }

    const updateFields = {};
    if(newSubjectName) updateFields.subjectName = newSubjectName;
    if(newDepartmentId) updateFields.department = newDepartmentId;

    const updatedSubjects = await Subject.findByIdAndUpdate(
        subjectId,
        { $set: updateFields },
        { new: true }
    );

    return res.status(200).json(
        new apiResponse(200, updatedSubjects, "update subject successfully..")
    )
});

const deleteSubject = asyncHandler(async(req, res) => {
    const { subjectId } = req.params;

    if (!subjectId) {
        throw new apiError(400, "subject id is required..");
    }

    await Subject.findByIdAndDelete(subjectId);

    return res.status(200).json(
        new apiResponse(200, "", "subject deleted successfully..")
    )
})

export {
    createSubject,
    getSubjectByDepartment,
    getSubjectById,
    updateSubject,
    deleteSubject
}