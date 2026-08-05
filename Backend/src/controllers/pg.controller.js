import { PG } from "../models/pg.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create PG
const PGregister = asyncHandler(async (req, res) => {
    const {
        pgName,
        location,
        price,
        withFood,
        withWifi,
        gender,
        sharedRoom,
        availability
    } = req.body;

    // Validation
    if (!pgName?.trim()) {
        throw new ApiError(400, "PG Name is required");
    }

    if (!location) {
        throw new ApiError(400, "Location is required");
    }

    if (!price) {
        throw new ApiError(400, "Price is required");
    }

    if (withFood === undefined) {
        throw new ApiError(400, "withFood is required");
    }

    if (withWifi === undefined) {
        throw new ApiError(400, "withWifi is required");
    }

    if (!gender) {
        throw new ApiError(400, "Gender is required");
    }

    if (!sharedRoom) {
        throw new ApiError(400, "Shared Room type is required");
    }

    if (!availability) {
        throw new ApiError(400, "Availability is required");
    }

    // Role check
    if (req.user.userRole !== "PG_Owner") {
        throw new ApiError(403, "Only PG owners can create PG");
    }

    const newPG = await PG.create({
        pgName,
        location,
        price,
        withFood,
        withWifi,
        gender,
        sharedRoom,
        availability,
        ownerId: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            newPG,
            "PG created successfully"
        )
    );
});

// Get All PGs
const getAllPGs = asyncHandler(async (req, res) => {
    const pgs = await PG.find()
        .populate("ownerId", "userName email phoneNo");

    return res.status(200).json(
        new ApiResponse(
            200,
            pgs,
            "All PGs fetched successfully"
        )
    );
});

// Get Single PG
const getSinglePG = asyncHandler(async (req, res) => {
    const { pgId } = req.params;

    if (!pgId) {
        throw new ApiError(400, "PG ID is required");
    }

    const pg = await PG.findById(pgId)
        .populate("ownerId", "userName email phoneNo");

    if (!pg) {
        throw new ApiError(404, "PG not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            pg,
            "PG fetched successfully"
        )
    );
});

// Update PG
const updatePG = asyncHandler(async (req, res) => {
    const { pgId } = req.params;

    if (!pgId) {
        throw new ApiError(400, "PG ID is required");
    }

    const pg = await PG.findById(pgId);

    if (!pg) {
        throw new ApiError(404, "PG not found");
    }

    if (pg.ownerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    const updatedPG = await PG.findByIdAndUpdate(
        pgId,
        {
            $set: req.body
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedPG,
            "PG updated successfully"
        )
    );
});

// Delete PG
const deletePG = asyncHandler(async (req, res) => {
    const { pgId } = req.params;

    if (!pgId) {
        throw new ApiError(400, "PG ID is required");
    }

    const pg = await PG.findById(pgId);

    if (!pg) {
        throw new ApiError(404, "PG not found");
    }

    if (pg.ownerId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await PG.findByIdAndDelete(pgId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "PG deleted successfully"
        )
    );
});

export {
    PGregister,
    getAllPGs,
    getSinglePG,
    updatePG,
    deletePG
};