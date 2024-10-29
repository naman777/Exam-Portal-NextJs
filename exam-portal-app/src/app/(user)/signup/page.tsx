"use client";
import axios from "axios";
import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { set } from "date-fns";
import Loader from "@/components/ui/loader";
import acmLogo from "/public/acmlogo2.svg";
import frontGroup from "/public/smart-people.svg";

const MODEL_URL = "https://face-detection-c8td.onrender.com"

type FormData = {
  name: string;
  rollNo: string;
  branch: string;
  phoneNo: string;
};

export default function FaceVerificationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    rollNo: "",
    branch: "",
    phoneNo: "",
  });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const email = session?.user?.email;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBranchChange = (value: string) => {
    setFormData((prev) => ({ ...prev, branch: value }));
  };

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setIsCapturing(false);
    }
  }, [webcamRef]);

  const retakeImage = () => {
    setCapturedImage(null);
    setIsVerified(false);
    setIsCapturing(true);
  };

  const verifyImage = async () => {
    if (!capturedImage) return;

    try {
      const byteString = atob(capturedImage.split(",")[1]);
      const mimeString = capturedImage
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      const formData = new FormData();
      formData.append("file", blob, "captured_face.jpg");
      setLoading(true);

      const res = await axios.post(MODEL_URL + "/count_faces", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);

      const result = res.data;
      if (result.result) {
        setIsVerified(result.result);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error verifying image:", error);
      alert("An error occurred while verifying your face. Please try again.");
      setIsVerified(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerified) {
      console.log("Form submitted:", formData);
      setLoading(true);
      try {
        if (capturedImage && email) {
          const byteString = atob(capturedImage.split(",")[1]);
          const mimeString = capturedImage
            .split(",")[0]
            .split(":")[1]
            .split(";")[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });

          const formDataToSend = new FormData();
          formDataToSend.append("name", formData.name);
          formDataToSend.append("rollNo", formData.rollNo);
          formDataToSend.append("branch", formData.branch);
          formDataToSend.append("phoneNo", formData.phoneNo);
          formDataToSend.append("image", blob, "captured_face.jpg");
          formDataToSend.append("email", email);

          setLoading(true);

          const res = await axios.post("/api/user/register", formDataToSend, {
            withCredentials: true,
          });
          const data = res.data;

          setLoading(false);

          if (data.success) {
            alert("Registration successful!");
            router.push("/dashboard");
          } else {
            alert(data.message);
            router.push("/");
          }
        }
      } catch (error) {
        alert("An error occurred while registering. Please try again.");
        console.error("Error registering user:", error);
      }
    } else {
      alert("Please verify your face before submitting the form.");
    }
  };

  return (
    <div className=" bg-white min-h-screen">
      <div className="flex justify-between items-center bg-white w-full p-0.5 shadow-2xl">
        {/* Logo in the center */}
        <div className="flex-1 flex justify-center">
          <Image
            src={acmLogo}
            alt="Logo"
            width={130}
            height={500}
            className="z-10"
          />
        </div>

        {/* Signout button aligned to the right */}
        {/* <div className="ml-auto">
          <button className="bg-lightblue px-2 py-1 text-lg text-white rounded-lg " onClick={()=>{
            signOut();
          }}>
            Signout
          </button>
        </div> */}
      </div>

      <div className=" flex justify-between">
        <div>
          <Image src="/acm.png" alt="Logo" width={100} height={1200} />
        </div>
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto space-y-6 mt-12"
        >
          <h1 className="text-2xl font-bold mb-6">Student Registration</h1>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNo">Roll No</Label>
            <Input
              id="rollNo"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Select onValueChange={handleBranchChange} value={formData.branch}>
              <SelectTrigger>
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COE">Computer Engineering</SelectItem>
                <SelectItem value="COPC">
                  Computer Science Engineering
                </SelectItem>
                <SelectItem value="ENC">
                  Electronics and Computer Engineering
                </SelectItem>
                <SelectItem value="ECE">
                  Electronics and Communication Engineering
                </SelectItem>
                <SelectItem value="COBS">
                  Computer Science abd Business Systems Engineering
                </SelectItem>
                <SelectItem value="other">
                  Other 
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNo">Phone No</Label>
            <Input
              id="phoneNo"
              name="phoneNo"
              type="tel"
              value={formData.phoneNo}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Face Verification</Label>
            {isCapturing ? (
              <div className="relative">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-lg"
                />
                <Button
                  onClick={captureImage}
                  className="ml-56 mt-4 bottom-4 left-1/2 transform -translate-x-1/2 bg-lightblue text-white"
                >
                  Capture
                </Button>
              </div>
            ) : capturedImage ? (
              <div className="space-y-2">
                <Image
                  src={capturedImage}
                  alt="Captured face"
                  className="w-full rounded-lg "
                  width={500}
                  height={500}
                />

                <div className="flex justify-between">
                  <Button onClick={retakeImage} variant="outline">
                    Retake
                  </Button>
                  <Button onClick={verifyImage} disabled={isVerified}>
                    {isVerified ? "Verified" : "Verify"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsCapturing(true)} className="w-full">
                Start Face Capture
              </Button>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-lightblue text-white "
            disabled={!isVerified}
          >
            Submit
          </Button>
        </form>
        <div>
          <Image
            src={frontGroup}
            alt="Logo"
            width={600}
            height={1200}
            className="m-10"
          />
        </div>
      </div>

      {loading && <Loader />}
    </div>
  );
}
