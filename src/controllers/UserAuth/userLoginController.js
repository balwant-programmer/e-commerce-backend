import bcrypt from "bcrypt";
import { generateToken } from "../../middlewares/userAuthjsonWebToke.js";
import { User } from "../../models/UserAutSchema.js";
import uploadImageCloudinary from "../../utils/Cloudinary.js";
import path from "node:path";
import nodemailer from "nodemailer";
import Otp from "../../models/changepassShema.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      userId: user._id,
      email: user.email,
      username: user.username,
    };
    const token = generateToken(payload);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 4 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userData } = user.toObject();
    res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default login;

//         logOut Controller...
export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error logging out. Please try again." });
  }
};

// --------- user Logo update ..............

export const userLogo = async (req, res) => {
  try {
    if (!req?.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filename =
      crypto.randomUUID() + path.extname(req?.file?.originalname);

    const url = await uploadImageCloudinary(req.file?.buffer, filename);

    if (!url) {
      return res
        .status(500)
        .json({ message: "Cloudinary internal server error" });
    }
    let user = await User.findByIdAndUpdate(
      req?.user?._id,
      { $set: { image: url } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { _id, image } = user?.toObject();
    user = { _id, image };
    return res
      .status(200)
      .json({ message: "Image uploaded successfully", user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};

// ----- user prifile update ...
export const userProfileUpdate = async (req, res) => {
  try {
    const { email, username } = req.body;
    const { _id } = req.user;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const update = await User.updateOne({ _id }, { email, username });
    if (update.modifiedCount === 1) {
      return res
        .status(200)
        .json({ message: "Profile updated successfully", success: true });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};

// -------- user Email  send otp .....

function generateNumericOTP(length) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateNumericOTP(6);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "bkgb511@gmail.com",
        pass: "xxsl leel exch jpyj",
      },
    });
    const existsUser = await Otp.findOne({ email });
    if (existsUser) {
      // Update OTP and expiration time
      existsUser.otp = otp;
      existsUser.expireAt = Date.now() + 180000; // Set expiration time to 3 minutes (180,000 ms)

      // Save the updated document
      await existsUser.save();

      // Send the OTP email
      await transporter.sendMail({
        from: "bkgb511@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It will expire in 3 minutes.`,
      });

      return res.status(200).json({
        message: "OTP resent successfully",
        success: true,
      });
    } else {
      const saveOtp = new Otp({
        email,
        otp,
        expireAt: Date.now() + 180000,
      });

      await saveOtp.save();

      await transporter.sendMail({
        from: "bkgb511@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It will expire in 3 minutes.`,
      });

      return res.status(200).json({
        message: "OTP sent successfully",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};

/// ---------  check otp is valid or not  ...
export const veryfyOtp = async (req, res) => {
  try {
    const { email, newpassword, otp } = req.body;
    if (!email || !newpassword || !otp) {
      return res
        .status(500)
        .json({ message: "Somethings is Wrong !", success: false });
    }

    const user = await Otp.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "otp Expires !", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    if (user.otp === otp) {
      const update = await User.updateOne(
        { email },
        { $set: { password: hashedPassword } }
      );
      if (update.modifiedCount === 1) {
        await Otp.deleteOne({ email });
        return res
          .status(200)
          .json({ message: "SuccessFully password Change !", success: true });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Otp not Match !", success: false });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
};
