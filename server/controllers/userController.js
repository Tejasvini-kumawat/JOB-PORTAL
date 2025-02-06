

//Get user data

import { clerkClient } from "@clerk/express";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";
import { v2 as cloudinary } from "cloudinary";

// Get User Data
export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await clerkClient.users.getUser(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Apply for a Job
export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.auth.userId;

        const isAlreadyApplied = await JobApplication.find({ jobId, userId });
        if (isAlreadyApplied.length > 0) {
            return res.status(400).json({ success: false, message: "Already applied" });
        }

        const jobData = await Job.findById(jobId);
        if (!jobData) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        });

        res.status(200).json({ success: true, message: "Applied Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get User Job Applications
export const getUserJobApplications = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const applications = await JobApplication.find({ userId })
            .populate("companyId", "name email image")
            .populate("jobId", "title description location category level salary")
            .exec();

        if (applications.length === 0) {
            return res.status(404).json({ success: false, message: "No job applications found for this user" });
        }

        return res.status(200).json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update User Resume
export const updateUserResume = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const resumeFile = req.file;
        const userData = await clerkClient.users.getUser(userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
            userData.resume = resumeUpload.secure_url;
        }

        await clerkClient.users.updateUser(userId, { publicMetadata: { resume: userData.resume } });

        return res.status(200).json({ success: true, message: "Resume Updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
