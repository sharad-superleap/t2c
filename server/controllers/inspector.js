import express from "express";
import { Inspector } from "../models/inspector.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



export const registerInspector = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            phone,
            dateOfBirth,
            "address.street": street,
            "address.city": city,
            "address.state": state,
            "address.pincode": pincode,
            serviceablePincodes,
            "kyc.aadhaar.number": aadhaarNumber,
            "kyc.pan.number": panNumber,
            "vehicle.type": vehicleType,
            "vehicle.name": vehicleName,
            "vehicle.registrationNumber": vehicleRegNumber,
            "bankDetails.accountHolderName": accountHolderName,
            "bankDetails.accountNumber": accountNumber,
            "bankDetails.ifscCode": ifscCode,
            "bankDetails.upiId": upiId,
        } = req.body;

        // basic validations
        // Basic required field check
        if (!fullName || !email || !password || !phone || !dateOfBirth) {
            return res.status(400).json({ message: "Please fill all required fields." });
        }

        if (!vehicleType) {
            return res.status(400).json({ message: "Vehicle type is required." });
        }


        // At least one KYC doc number required
        if (!aadhaarNumber && !panNumber) {
            return res.status(400).json({ message: "At least one KYC document (Aadhaar or PAN) is required." });
        }


        // check duplicate
        const existingInspector = await Inspector.findOne({ email });

        if (existingInspector) {
            return res.status(409)
                .json({
                    success: false,
                    message: `An inspector account with this email already exists.`
                })
        }

        // hash the password
        const hashedPassword = bcrypt.hash(password, 10);

        // handle file uploads 
        const files = req.files || [];

        let profilePhotoUrl = null;
        let aadhaarFrontUrl = null;
        let aadhaarBackUrl = null;
        let panImageUrl = null;
        let rcImageUrl = null;


        if (files.profilePhoto?.[0]) {
            const uploaded = await uploadToCloudinary(files.profilePhoto?.[0].buffer, "inspector-profiles");
            profilePhotoUrl = uploaded.secure_url;
        }

        if (files.aadhaarFront?.[0]) {
            const uploaded = await uploadToCloudinary(files.aadhaarFront[0].buffer, "inspector-kyc");
            aadhaarFrontUrl = uploaded.secure_url;
        }

        if (files.aadhaarBack?.[0]) {
            const uploaded = await uploadToCloudinary(files.aadhaarBack[0].buffer, "inspector-kyc");
            aadhaarBackUrl = uploaded.secure_url;
        }

        if (files.panImage?.[0]) {
            const uploaded = await uploadToCloudinary(files.panImage[0].buffer, "inspector-kyc");
            panImageUrl = uploaded.secure_url;
        }

        if (files.rcImage?.[0]) {
            const uploaded = await uploadToCloudinary(files.rcImage[0].buffer, "inspector-vehicles");
            rcImageUrl = uploaded.secure_url;
        }

        // mask aadhar number before storing
        const maskedAadhaar = aadhaarNumber
            ? `XXXX-XXXX-${aadhaarNumber.toString().slice(-4)}`
            : null;


        // create inspector
        const inspector = await Inspector.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
            dateOfBirth,
            profilePhoto: profilePhotoUrl,
            role: "inspector",
            address: { street, city, state, pincode },
            serviceablePincodes: serviceablePincodes
                ? JSON.parse(serviceablePincodes)  // sent as JSON string from FormData
                : [],
            kyc: {
                aadhaar: {
                    number: maskedAadhaar,
                    frontImage: aadhaarFrontUrl,
                    backImage: aadhaarBackUrl,
                },
                pan: {
                    number: panNumber || null,
                    image: panImageUrl,
                },
            },
            vehicle: {
                type: vehicleType,
                name: vehicleName,
                registrationNumber: vehicleRegNumber,
                rcImage: rcImageUrl,
            },
            bankDetails: {
                accountHolderName,
                accountNumber,
                ifscCode,
                upiId,
            },
        });

        return res.status(201)
            .json({
                success: true,
                message: `Inspector ${inspector.fullName}, registered successfully. Your account is under review.`,
                inspector: {
                    id: inspector._id,
                    fullName: inspector.fullName,
                    email: inspector.email,
                    role: inspector.role,
                    status: inspector.status,
                },
            })

    } catch (err) {
        return res.status(500)
            .json({
                success: false,
                message: `Internal server error while registering as an inspector, ${err.message}`
            })
    }
}