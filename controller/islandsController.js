import { MESSAGE } from "../helpers/message.helper.js";
import islandModels from "../models/island.models.js";
import responseHelper from "../helpers/response.helper.js";
import islandImagesModels from "../models/islandImages.models.js";
import { closeSync } from "fs";

const { send200, send403, send400, send401, send404, send500 } = responseHelper;


// Create a new island
// export const createIsland = async (req, res) => {
//   const {
//     title,
//     about,
//     best_time,
//     popular_beaches,
//     things_to_do,
//     extra_content,
//     images,
//     meta,
//   } = req.body;

//   if (!title || !about || !best_time || !popular_beaches || !things_to_do) {
//     return send400(res, { status: false, message: MESSAGE.FIELDS_REQUIRED });
//   }

//   try {
//     const newIsland = new islandModels({
//       title,
//       about,
//       best_time,
//       popular_beaches,
//       things_to_do,
//       extra_content,
//       images,
//       meta,
//     });

//     await newIsland.save();
//     send200(res, {
//       status: true,
//       message: MESSAGE.ISLAND_CREATED,
//       data: newIsland,
//     });
//   } catch (error) {
//     send500(res, { status: false, message: error.message });
//   }
// };
export const createIsland = async (req, res) => {
  const {
    title,
    about,
    best_time,
    cover_image,
    popular_beaches,
    things_to_do,
    extra_content,
    images,
    meta,
    tags,
  } = req.body;

  // Validate required fields
  if (!title || !about || !best_time || !popular_beaches || !things_to_do) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    // Create new island document using the provided data
    const newIsland = new islandModels({
      title,
      about,
      best_time,
      cover_image,
      popular_beaches,
      things_to_do,
      extra_content,
      images,
      meta,
      tags,
    });

    // Save the island to the database
    const savedIsland = await newIsland.save();

    // Return the saved island in the response
    res.status(201).json(savedIsland);
  } catch (error) {
    // Handle any errors and return the error message
    res.status(400).json({ error: error.message });
  }
};



// Get all islands with pagination
export const getAllIslands = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Set default page to 1 and limit to 10

  try {
    const skip = (page - 1) * limit; // Calculate the number of records to skip
    const islands = await islandModels
      .find()
      .populate("images") // Populate the images
      .skip(skip)
      .limit(Number(limit)); // Limit the results

    const totalIslands = await islandModels.countDocuments(); // Count total islands

    send200(res, {
      status: true,
      data: islands,
      pagination: {
        total: totalIslands,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalIslands / limit), // Calculate total pages
      },
    });
  } catch (error) {
    send500(res, { status: false, message: error.message });
  }
};

// Get island by ID
export const getIslandById = async (req, res) => {
  const { id } = req.params;

  try {
    const island = await islandModels.findById(id).populate("images");
    if (!island) {
      return send404(res, { status: false, message: MESSAGE.ISLAND_NOT_FOUND });
    }
    send200(res, { status: true, data: island });
  } catch (error) {
    send500(res, { status: false, message: error.message });
  }
};

// Update island
export const updateIsland = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedIsland = await islandModels.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedIsland) {
      return send404(res, { status: false, message: MESSAGE.ISLAND_NOT_FOUND });
    }
    send200(res, {
      status: true,
      message: MESSAGE.ISLAND_UPDATED,
      data: updatedIsland,
    });
  } catch (error) {
    send500(res, { status: false, message: error.message });
  }
};

// Delete island
export const deleteIsland = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedIsland = await islandModels.findByIdAndDelete(id);
    if (!deletedIsland) {
      return send404(res, { status: false, message: MESSAGE.ISLAND_NOT_FOUND });
    }
    send200(res, { status: true, message: MESSAGE.ISLAND_DELETED });
  } catch (error) {
    send500(res, { status: false, message: error.message });
  }
};


export const createIslandImage = async (req, res) => {
  const { image_title, image_desc, image_url, islandId } = req.body;

  if (!image_title || !image_desc || !image_url || !islandId) {
    return send400(res, { status: false, message: MESSAGE.FIELDS_REQUIRED });
  }

  try {
    const newImage = new islandImagesModels({
      image_title,
      image_desc,
      image_url,
      islandId,
    });

    await newImage.save();

    // Optionally, you can also add the image ID to the island's image array
    // await Island.findByIdAndUpdate(islandId, { $push: { images: newImage._id } });

    send200(res, {
      status: true,
      message: MESSAGE.ISLAND_IMAGE_CREATED,
      data: newImage,
    });
  } catch (error) {
    send500(res, { status: false, message: error.message });
  }
};

// Get all images for a specific island
export const getIslandImagesByIslandId = async (req, res) => {
  const { islandId } = req.query;

  if (!islandId) {
    return send400(res, { status: false, message: MESSAGE.ISLAND_ID_REQUIRED });
  }

  try {
    const images = await islandImagesModels.find({ islandId });

    send200(res, { status: true, data: images });
  } catch (error) {
    send500(res, { status: false, message: error.message });
  }
};