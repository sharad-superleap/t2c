import { model, Schema } from "mongoose";

const pickUpSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address: {
        pincode: String,
        street: String,
        city: String,
        state: String,
        country: String,
    },
    wasteTypes: {
        type: [String],
        enum: ["plastic", "paper", "metal", "glass", "organic", "mixed"],
        required: true
    },
    pickUpDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["pending", "assigned", "picked_up", "cancelled"],
        default: "pending",
    },
    notes: {
        type: String,
    },
    imageUrls: {
        type: [String],
        default: [],
        validate: {
            validator: function (images) {
                return !images || images.length <= 3;
            },
            message: "You can upload a maximum of 3 images."
        }
    }
}, { timestamps: true })

export const Pickup = model('Pickups', pickUpSchema);