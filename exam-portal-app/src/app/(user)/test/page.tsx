"use client";
import React, { useState, useEffect } from "react";
import McqComponent, { Mcq } from "../../../components/Test/McqComponent";
import McqSidebar from "../../../components/Test/McqSidebar";

const sampleMcqs: Mcq[] = [
  {
    id: 1,
    question: "What is the output of the following code snippet?",
    option1: "19 82",
    option2: "Compilation Error",
    option3: "82 19",
    option4: "None of the above",
    answer: "19 82",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 2,
    question: "What does HTML stand for?",
    option1: "Hyperlinks and Text Markup Language",
    option2: "Hyper Text Markup Language",
    option3: "Home Tool Markup Language",
    option4: "None of the above",
    answer: "Hyper Text Markup Language",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 3,
    question: "What is the output of the following code snippet?",
    option1: "19 82",
    option2: "Compilation Error",
    option3: "82 19",
    option4: "None of the above",
    answer: "19 82",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 4,
    question: "What does HTML stand for?",
    option1: "Hyperlinks and Text Markup Language",
    option2: "Hyper Text Markup Language",
    option3: "Home Tool Markup Language",
    option4: "None of the above",
    answer: "Hyper Text Markup Language",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 5,
    question: "What is the output of the following code snippet?",
    option1: "19 82",
    option2: "Compilation Error",
    option3: "82 19",
    option4: "None of the above",
    answer: "19 82",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 6,
    question: "What does HTML stand for?",
    option1: "Hyperlinks and Text Markup Language",
    option2: "Hyper Text Markup Language",
    option3: "Home Tool Markup Language",
    option4: "None of the above",
    answer: "Hyper Text Markup Language",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 7,
    question: "What is the output of the following code snippet?",
    option1: "19 82",
    option2: "Compilation Error",
    option3: "82 19",
    option4: "None of the above",
    answer: "19 82",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 8,
    question: "What does HTML stand for?",
    option1: "Hyperlinks and Text Markup Language",
    option2: "Hyper Text Markup Language",
    option3: "Home Tool Markup Language",
    option4: "None of the above",
    answer: "Hyper Text Markup Language",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 9,
    question: "What is the output of the following code snippet?",
    option1: "19 82",
    option2: "Compilation Error",
    option3: "82 19",
    option4: "None of the above",
    answer: "19 82",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 10,
    question: "What does HTML stand for?",
    option1: "Hyperlinks and Text Markup Language",
    option2: "Hyper Text Markup Language",
    option3: "Home Tool Markup Language",
    option4: "None of the above",
    answer: "Hyper Text Markup Language",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 11,
    question: "What is the output of the following code snippet?",
    option1: "19 82",
    option2: "Compilation Error",
    option3: "82 19",
    option4: "None of the above",
    answer: "19 82",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 12,
    question: "What does HTML stand for?",
    option1: "Hyperlinks and Text Markup Language",
    option2: "Hyper Text Markup Language",
    option3: "Home Tool Markup Language",
    option4: "None of the above",
    answer: "Hyper Text Markup Language",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 13,
    question: "What is the output of the following code snippet?",
    option1: "19 82",
    option2: "Compilation Error",
    option3: "82 19",
    option4: "None of the above",
    answer: "19 82",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  {
    id: 14,
    question: "What does HTML stand for?",
    option1: "Hyperlinks and Text Markup Language",
    option2: "Hyper Text Markup Language",
    option3: "Home Tool Markup Language",
    option4: "None of the above",
    answer: "Hyper Text Markup Language",
    marks: 1,
    createdAt: new Date(),
    testId: "123",
  },
  // Add more questions as needed
];

export default function Home() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>(() =>
    JSON.parse(localStorage.getItem("mcqanswers") || "{}")
  );

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < sampleMcqs.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const updateAnswer = (questionId: number, answer: string) => {
    const newAnswers = { ...mcqAnswers, [questionId]: answer };
    setMcqAnswers(newAnswers);
    localStorage.setItem("mcqanswers", JSON.stringify(newAnswers));
  };

  return (
    <div className="p-8 bg-gray-100 flex gap-10">

      <div className="w-3/4">
        <McqComponent
          mcq={sampleMcqs[currentQuestionIndex]}
          updateAnswer={updateAnswer}
        />
      </div>
        <McqSidebar
          mcqAnswers={mcqAnswers}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={sampleMcqs.length}
          handleQuestionClick={handleQuestionClick}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
    </div>
  );
}
