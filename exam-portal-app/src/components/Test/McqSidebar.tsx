"use client";
import React, { useState, useEffect } from "react";
import categories from "/public/categories.svg";
import Image from "next/image";
import Loader from "../ui/loader";
import { handleTestSubmit } from "@/actions/user";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { warning } from "framer-motion";

interface McqSidebarProps {
  mcqAnswers: Record<string, string>;
  currentQuestionIndex: number;
  totalQuestions: number;
  handleQuestionClick: (index: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
  showCoding: boolean; // Track if it's the coding section or MCQ
  codingQuestions: number; // Number of coding questions
  currentCode: string; // Current code in the editor
  setCurrentCode: (code: string) => void; // Function to update code
  codingQuestionIndex: number; // Current coding question index
  handleCodingQuestionClick: (index: number) => void; // Handle coding question navigation
  warning: number;
  answeredQuestion: any;
}

const McqSidebar: React.FC<McqSidebarProps> = ({
  mcqAnswers,
  currentQuestionIndex,
  totalQuestions,
  handleQuestionClick,
  handlePrev,
  handleNext,
  showCoding,
  codingQuestions,
  currentCode,
  setCurrentCode,
  codingQuestionIndex,
  handleCodingQuestionClick,
  warning,
  answeredQuestion,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Load saved code when the coding question changes
    if (showCoding) {
      const savedCode = localStorage.getItem(
        `code_question_${codingQuestionIndex}`
      );
      setCurrentCode(savedCode || ""); // Load saved code or empty the editor
    }
  }, [codingQuestionIndex, showCoding, setCurrentCode]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await handleTestSubmit(
      session!.user!.email!,
      mcqAnswers,
      warning
    );
    setLoading(false);

    if (res.success) {
      toast.success("Test submitted successfully");
      router.push("/dashboard");
    } else {
      toast.error(res.message);
    }
    closeModal();
  };

  const saveCurrentCode = () => {
    if (showCoding) {
      localStorage.setItem(`code_question_${codingQuestionIndex}`, currentCode);
      toast.success("Code saved successfully");
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-white shadow-xl rounded-lg h-auto">
        <h2 className="text-xl font-semibold mb-4 text-center flex justify-center gap-3 items-center">
          {showCoding ? "Coding" : "Quiz (MCQ)"}
          <Image src={categories} alt="categories" className="w-6 h-6" />
        </h2>

        {/* MCQ or Coding Navigation */}
        {showCoding ? (
          <div>
            <div className="mb-6 bg-gray rounded-lg p-3">
              <h3 className="text-lg font-medium mb-2">MCQ Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalQuestions }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(index)}
                    className={`p-2 rounded-md text-white ${
                      answeredQuestion[index] ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            {/* <div className="mb-6 bg-gray rounded-lg p-3">
              <h3 className="text-lg font-medium mb-2">Coding Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: codingQuestions }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      saveCurrentCode(); // Save current code before switching questions
                      handleCodingQuestionClick(index);
                    }}
                    className={`p-2 rounded-md text-white ${
                      localStorage.getItem(`code_question_${index}`)
                        ? "bg-green-500" // Green if code is saved for this question
                        : "bg-red-500" // Red if code isn't saved
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        ) : (
          <div>
            <div className="mb-6 bg-gray rounded-lg p-3">
              <h3 className="text-lg font-medium mb-2">MCQ Questions</h3>
              <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: totalQuestions }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(index)}
                    className={`p-2 rounded-md text-white ${
                      answeredQuestion[index] ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            {/* <div className="mb-6 bg-gray rounded-lg p-3">
              <h3 className="text-lg font-medium mb-2">Coding Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: codingQuestions }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      saveCurrentCode(); // Save current code before switching questions
                      handleCodingQuestionClick(index);
                    }}
                    className={`p-2 rounded-md text-white ${
                      localStorage.getItem(`code_question_${index}`)
                        ? "bg-green-500" // Green if code is saved for this question
                        : "bg-red-500" // Red if code isn't saved
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={
                showCoding
                  ? codingQuestionIndex === 0
                  : currentQuestionIndex === 0
              }
              className="px-4 py-2 font-bold text-lightblue border-lightblue rounded-md bg-white hover:bg-lightblue hover:text-white border-2"
            >
              &lt; Previous
            </button>
            <button
              onClick={handleNext}
              disabled={
                showCoding
                  ? codingQuestionIndex === codingQuestions - 1
                  : currentQuestionIndex === totalQuestions - 1
              }
              className="px-4 py-2 border rounded-md bg-lightblue text-white hover:bg-white hover:text-lightblue hover:border-2 hover:font-bold"
            >
              Next &gt;
            </button>
          </div>

          {/* Save Code Button */}
          {showCoding && (
            <button
              onClick={saveCurrentCode}
              className="w-full bg-lightblue p-2 rounded-lg text-white font-bold"
            >
              Save Code
            </button>
          )}

          {/* Submit Button */}
          <button
            onClick={openModal}
            className="w-full bg-lightblue p-2 rounded-lg text-white font-bold"
          >
            Review and Submit
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
          <div className="bg-gray p-6 rounded-lg shadow-lg w-1/3">
            <div className="flex flex-col ">
              <h2 className="text-2xl font-semibold mb-4">
                Review Your Answers
              </h2>
              <h1 className="text-xl font-semibold">Mcq Questions Review</h1>
              <div className="grid grid-cols-5 gap-2 mb-6">
              {Array.from({ length: totalQuestions }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(index)}
                    className={`p-2 rounded-md text-white ${
                      answeredQuestion[index] ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            {/* <div className="flex flex-col">
              <h1 className="text-xl font-semibold">Mcq Questions Review</h1>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {Array.from({ length: codingQuestions }, (_, index) => (
                  <div
                    key={index}
                    className={`py-1 text-center text-white rounded-lg ${
                      localStorage.getItem(`code_question_${index}`)
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div> */}
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-lightblue text-white hover:bg-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <Loader />}
    </>
  );
};

export default McqSidebar;
