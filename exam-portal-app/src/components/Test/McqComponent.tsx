"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";

export interface Mcq {
  id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  marks: number;
  createdAt: Date;
  testId: string;
  imageurl?: string;
}

interface McqComponentProps {
  mcq: Mcq;
  updateAnswer: (questionId: number, answer: string) => void;
  mcqAnswers: Record<number, string>;
}

const McqComponent: React.FC<McqComponentProps> = ({ mcq, updateAnswer, mcqAnswers }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the saved answer from `mcqAnswers` if it exists
    if (mcqAnswers[mcq.id]) {
      setSelectedOption(mcqAnswers[mcq.id]);
    }
  }, [mcq, mcqAnswers]);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    updateAnswer(mcq.id, option);

    // Save selected answer to local storage to persist
    const updatedAnswers = { ...mcqAnswers, [mcq.id]: option };
    localStorage.setItem("mcqanswers", JSON.stringify(updatedAnswers));
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="p-4 rounded-lg shadow-xl bg-white">
      <h1 className="text-2xl font-bold">Multiple Choice Questions</h1>
      <h2 className="text-lg mt-7 text-[#4a4949]">
        Question: {mcq.question}
      </h2>
      {mcq.imageurl && (
        <Image
          src={mcq.imageurl}
          alt="question image"
          width={800}
          height={200}
          className="mb-4"
        />
      )}

      <div className="space-y-2 mt-4">
        <h1 className="text-[#8C8C8C]">Choose the correct option(s)</h1>
        {[mcq.option1, mcq.option2, mcq.option3, mcq.option4].map(
          (option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`flex items-center gap-2 w-full text-left p-3 rounded-lg ${
                selectedOption === option
                  ? "bg-[#0BAADD57] text-black"
                  : "bg-[#F4F4F6]"
              }`}
            >
              <span className="font-bold flex items-center justify-center w-6 h-6 border-2 bg-white border-black rounded-full">
                {optionLabels[index]}
              </span>
              <span>{option}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default McqComponent;
