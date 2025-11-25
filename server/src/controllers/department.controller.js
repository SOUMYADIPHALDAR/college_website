import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import Department from "../models/department.model.js";

const createDepartment = asyncHandler(async(req, res) => {
    const { departmentName, year } = req.body;

    if (!departmentName || !year) {
        throw new apiError(400, "Department name and year is required..");
    }

    const existingDept = await Department.find({$or: [{departmentName}]});
    if (existingDept) {
        throw new apiError(400, "This department is already exists..");
    }

    const department = await Department.create({
        departmentName,
        year
    });

    return res.status(201).json(
        new apiResponse(201, department, "Add new department seccessfully..")
    )
});

const getAllDepartments = asyncHandler(async(req, res) => {
    const { year } = req.query;

    if (!year) {
        throw new apiError(400, "Year is required..");
    }

    const department = await Department.find({year});

    if (!department || department.length === 0) {
        throw new apiError(404, "Invalid year..");
    }

    return res.status(200).json(
        new apiResponse(200, department, "All department fetched successfully..")
    )
});

const getDepartmentById = asyncHandler(async(req, res) => {
    const { departmentId } = req.params;

    if (!departmentId) {
        throw new apiError(400, "department id is required..");
    }

    const department = await Department.findById(departmentId);

    if (!department) {
        throw new apiError(404, "Department not found..");
    }

    return res.status(200).json(
        new apiResponse(200, department, "Department fetched successfully..")
    )
});

export {
    createDepartment,
    getAllDepartments,
    getDepartmentById
}