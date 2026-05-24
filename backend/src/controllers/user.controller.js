import User from "../models/user.singup.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendEmail from "../config/email.js";
import { generateWelcomeTemplate } from "../utils/emailTemplates.js";


export const signup = async (req, res) => {
    try {
        const { name, fathername, email, Rollno, gender, Branch, phone, password } = req.body;

        // Validation
        if (!name || !fathername || !email || !Rollno || !gender || !Branch || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { Rollno }] 
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already exists" });
            }
            if (existingUser.Rollno === Rollno) {
                return res.status(400).json({ message: "Rollno already exists" });
            }
        }

        const existingName = await User.findOne({ name, fathername });
        if (existingName) {
            return res.status(400).json({ message: "Name and Fathername already exists" });
        }

        // Handle Image
        const imageLocalPath = req.file?.path;
        if (!imageLocalPath) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            name,
            fathername,
            email,
            Rollno,
            gender,
            Branch,
            phone,
            image: imageLocalPath,
            password: hashedPassword
        });

        // Create Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Remove password from response
        const createdUser = await User.findById(user._id).select("-password");

        // Send Welcome Email
        const welcomeHtml = generateWelcomeTemplate(user.name);
        const emailResult = await sendEmail(user.email, "Welcome to Our Platform!", `Hi ${user.name}, welcome aboard!`, welcomeHtml);
        console.log('Email result:', emailResult);
        return res.status(201).json({
            message: "User created successfully",
            user: createdUser,
            token
        });
    } catch (error) {

        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Create Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Remove password from response
        const loggedInUser = await User.findById(user._id).select("-password");

        return res.status(200).json({
            message: "Login successful",
            user: loggedInUser,
            token
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const logout = async (req, res) => {
    try {
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
