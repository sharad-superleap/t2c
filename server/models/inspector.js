import mongoose from "mongoose";

const inspectorSchema = new mongoose.Schema({
    // Personal Details (no user ref, standalone account)
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    profilePhoto: { type: String },

    role: { type: String, default: "inspector" }, // always inspector

    // Address
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String,
    },
    // serviceablePincodes: [String],

    // KYC
    kyc: {
        aadhaar: {
            number: String,         // store masked
            frontImage: String,
            backImage: String,
        },
        pan: {
            number: String,
            image: String,
        },
    },

    // Vehicle
    vehicle: {
        type: {
            type: String,
            enum: ["bike", "cycle", "mini_van", "auto", "pickup_truck"],
            required: true
        },
        name: String,
        registrationNumber: String,
        rcImage: String,
    },

    // Bank / Payout
    bankDetails: {
        accountHolderName: String,
        accountNumber: String,
        ifscCode: String,
        upiId: String,
    },

    // Approval
    status: {
        type: String,
        enum: ["pending", "under_review", "approved", "rejected", "suspended"],
        default: "pending"
    },
    rejectionReason: { type: String, default: null },
    reviewedAt: Date,
    approvedAt: Date,

    // Stats
    stats: {
        totalPickups: { type: Number, default: 0 },
        completedPickups: { type: Number, default: 0 },
        cancelledPickups: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
        totalRatings: { type: Number, default: 0 },
        totalEarnings: { type: Number, default: 0 },
    },

    // Live
    isAvailable: { type: Boolean, default: false },
    lastLocation: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] }
    },

}, { timestamps: true });

inspectorSchema.index({ lastLocation: "2dsphere" });
inspectorSchema.index({ status: 1 });

const Inspector = mongoose.model("Inspector", inspectorSchema);
export default Inspector;