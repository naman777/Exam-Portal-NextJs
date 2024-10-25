import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/db";
import { v2 as cloudinaryV2 } from "cloudinary";

const admin_password = process.env.ADMIN_PASSWORD;

cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const testId = formData.get("testId") as string;
    const pass = formData.get("password") as string;
    
    if (pass !== admin_password) {
      return NextResponse.json({
        status: 401,
        success: false,
        message: "Unauthorized"
      });
    }

    let imageurl = null;
    const imageFile = formData.get("image");

    if (imageFile && imageFile instanceof Blob) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      // Upload image to Cloudinary
      const cloudinaryResponse = await new Promise((resolve, reject) => {
        cloudinaryV2.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          })
          .end(buffer);
      });

      imageurl = (cloudinaryResponse as { secure_url: string }).secure_url;
    }

    const test = await prisma.testSlot.findUnique({
      where: {
        id: testId,
      },
    });

    if (!test) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Test not found"
      });
    }

    const mcq = await prisma.mcq.create({
      data: {
        question: formData.get("question") as string,
        option1: formData.get("option1") as string,
        option2: formData.get("option2") as string,
        option3: formData.get("option3") as string,
        option4: formData.get("option4") as string,
        answer: formData.get("answer") as string,
        marks: parseInt(formData.get("marks") as string, 10),
        testId: testId,
        imageurl: imageurl,
      },
    });

    return NextResponse.json({
      status: 201,
      success: true,
      message: "MCQ created successfully",
      data: mcq
    });
  } catch (error) {
    console.error("Error during MCQ creation:", error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal Server Error"
    });
  }
}
