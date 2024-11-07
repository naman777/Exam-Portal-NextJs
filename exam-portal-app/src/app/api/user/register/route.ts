import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/authOptions";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";
import prisma from "../../../../../lib/db";

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
    const rollNo = formData.get("rollNo")?.toString();
    const branch = formData.get("branch")?.toString();
    const phone = formData.get("phoneNo")?.toString();
    const imageFile = formData.get("image") as File;
    const email = formData.get("email")?.toString();

    // Convert ReadableStream to Buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Upload image to Cloudinary
    const cloudinaryResponse = await new Promise((resolve, reject) => {
      cloudinaryV2.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }).end(buffer); // Send the Buffer to Cloudinary
    });

    const imageUrl = (cloudinaryResponse as { secure_url: string }).secure_url;

    // Create user in Prisma
    const newUser = await prisma.user.update({
      where: {
        email: email, 
        signUp: false
      },
      data: {
        name,
        rollNo,
        branch,
        phone,
        signUp: true,
        imageurl: imageUrl // Store the Cloudinary image URL in the database
      }
    });

    return NextResponse.json({
      success: true,
      user: newUser
    });

  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json({
      status: 500,
      error: "An error occurred during registration."
    });
  }
}
