"use client";
import React, { useState } from "react";
import categories from "/public/categories.svg";
import Image from "next/image";

interface McqSidebarProps {
  mcqAnswers: Record<string, string>;
  currentQuestionIndex: number;
  totalQuestions: number;
  handleQuestionClick: (index: number) => void;
  handlePrev: () => void;
  handleNext: () => void;
}

const McqSidebar: React.FC<McqSidebarProps> = ({
  mcqAnswers,
  currentQuestionIndex,
  totalQuestions,
  handleQuestionClick,
  handlePrev,
  handleNext,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle the modal

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = () => {
    console.log("Quiz Submitted!");
    closeModal();
  };

  return (
    <>
      {/* Sidebar Component */}
      <div className="w-1/4 p-4 bg-white shadow-xl rounded-lg h-auto">
        <h2 className="text-xl font-semibold mb-4 items-center text-center flex justify-center gap-3">
          Categories   
          <Image src={categories} alt="categories" className="w-6 h-6" />
        </h2>
        
        <div className="mb-6 bg-gray rounded-lg p-3">
          <h3 className="text-lg font-medium mb-2">Quiz (MCQ)</h3>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: totalQuestions }, (_, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(index)}
                className={`p-2 rounded-md text-white ${
                  mcqAnswers[index + 1] ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 font-bold border-lightblue rounded-md bg-white hover:bg-lightblue hover:text-white text-lightblue border-2"
            >
              &lt; Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="px-4 py-2 border rounded-md bg-lightblue text-white hover:bg-white hover:text-lightblue hover:border-2 hover:font-bold "
            >
              Next &gt;
            </button>
          </div>
          <button
            onClick={openModal}
            className="w-full bg-lightblue p-2 rounded-lg text-white font-bold"
          >
            Review and Submit
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Review Your Answers</h2>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {Array.from({ length: totalQuestions }, (_, index) => (
                <div
                  key={index}
                  className={` py-1 text-center text-white rounded-lg ${
                    mcqAnswers[index + 1] ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
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
    </>
  );
};

export default McqSidebar;
