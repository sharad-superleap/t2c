import { Pickup } from "../models/pickup.js";
import { User } from "../models/user.js";

export const registerPickup = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400)
                .json({
                    message: `login first.`
                })
        }

        // find the user first
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404)
                .json(
                    {
                        message: `User not found.`
                    }
                )
        }


        // request body
        const { wasteTypes, notes } = req.body;

        if (!wasteTypes) {
            return res.status(400)
                .json({
                    message: `Please select atleast one waste type.`
                })
        }


        const imageUrls = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadedImage = await uploadToCloudinary(
                    file.buffer,
                    "pickup-images"
                );

                imageUrls.push(uploadedImage.secure_url);
            }
        }

        const pickup = await Pickup.create({
            user: existingUser._id,
            address: {
                pincode: existingUser.address.pincode,
                street: existingUser.address.street,
                city: existingUser.address.city,
                state: existingUser.address.state,
                country: existingUser.address.country
            },
            wasteTypes: wasteTypes,
            notes,
            imageUrls
        })

        return res.status(201)
            .json({
                success: true,
                message: `Pickup Created Successfully, ${pickup._id}`,
            })

    } catch (err) {
        return res.status(500)
            .json({
                message: `Internal server error ${err.message}`
            })
    }
}

export const getPickUpsHistoryByUserId = async (req, res) => {
    try {
        const userId = req.user.userId;


        if (!userId) {
            return res.status(400)
                .json({
                    success: false,
                    message: `login first`
                })
        }

        // find the pickups associated with the user.
        const pickups = await Pickup.find({ user: userId });

        if (!pickups) {
            return res.status(404)
                .json({
                    success: false,
                    message: `No pickups found.`
                })
        }

        return res.status(200)
            .json({
                success: true,
                pickups
            })

    } catch (err) {
        return res.status(500)
            .json({
                success: false,
                message: `Internal Server Error, ${err.message}`
            })
    }
}

export const deletePickup = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { pickupId } = req.params;

        if (!userId) {
            return res.status(400)
                .json({ message: "Login first." });
        }

        // find pickup
        const pickup = await Pickup.findById(pickupId);

        if (!pickup) {
            return res.status(404)
                .json({
                    success: false,
                    message: `No Pickup found.`
                })
        }

        // ownership check
        if (pickup.user.toString() !== userId) {
            return res.status(403)
                .json({
                    success: false,
                    message: `Not Authorized.`
                })
        }

        // deletion allowed only in the first 3 minute window
        const now = Date.now();

        const createdTime = new Date(pickup.createdAt).getTime();

        const diff = now - createdTime;

        const THREE_MINUTES_IN_MS = 3 * 60 * 1000;

        if (diff > THREE_MINUTES_IN_MS) {
            return res.status(403).json({
                success: false,
                message: `You can only delete within 3 minutes of creation.`
            });
        }

        await Pickup.deleteOne({ _id: pickupId });

        return res.status(200)
            .json({
                success: true,
                message: `Pickup deleted successfully.`
            })

    } catch (err) {
        return res.status(500)
            .json({
                success: false,
                message: `Internal Server Error, ${err.message}`
            })
    }
}