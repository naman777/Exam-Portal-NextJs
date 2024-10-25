"use client";
import React, { useState, useEffect } from "react";
import McqComponent, { Mcq } from "../../../components/Test/McqComponent";
import McqSidebar from "../../../components/Test/McqSidebar";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { checkForTest, handleTestSubmit } from "@/actions/user";
import { set } from "date-fns";

const sample: Mcq[] = [
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

interface McqFortest {
  id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  marks: number;
}

export default function Home() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>(() =>
      JSON.parse(localStorage.getItem("mcqanswers") || "{}")
    );
    const [mcqs, setMcqs] = useState<Mcq[]>([]);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // Time in seconds
    const [loading, setLoading] = useState(false);
  
    const { data: session } = useSession();
    const email = session?.user?.email;
    const router = useRouter();
  
    useEffect(() => {
      const fetch = async () => {
        if (!session || !email) {
          toast.error("You are not logged in");
          router.push("/");
        }
  
        const res = await checkForTest(email as string);
        if (!res.success) {
          toast.error(res.message);
          router.push("/dashboard");
        } else {
          toast.success("You can give the test now");
          setMcqs(res.testSlot?.mcqs as Mcq[]);
          const end = res.testSlot?.endTime ? new Date(res.testSlot.endTime) : new Date();
          setEndTime(end);
  
          // Calculate the remaining time with 5 minutes buffer
          const remainingTime = (end.getTime() - Date.now()) / 1000 - 5 * 60;
          setTimeRemaining(remainingTime);
        }
      };
      fetch();
    }, [session, email]);
  
    useEffect(() => {
      if (timeRemaining === null) return;
  
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            clearInterval(interval);
            setLoading(true);
            handleAutoSubmit();
            return 0;
          }
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }, [timeRemaining]);
  
    const handleAutoSubmit = async () => {
      toast.error("Time is up. Test will be submitted automatically");
      setLoading(true);
      console.log(mcqAnswers);
      const res = await handleTestSubmit(session!.user!.email!, mcqAnswers);
      setLoading(false);
  
      if (res.success) {
        toast.success("Test submitted successfully");
        router.push("/dashboard");
      } else {
        toast.error(res.message);
      }
    };
  
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };
  
    const handleQuestionClick = (index: number) => {
      setCurrentQuestionIndex(index);
    };
  
    const handlePrev = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1);
      }
    };
  
    const handleNext = () => {
      if (currentQuestionIndex < mcqs.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    };
  
    const updateAnswer = (questionId: number, answer: string) => {
      const newAnswers = { ...mcqAnswers, [questionId]: answer };
      setMcqAnswers(newAnswers);
    };
  
    return (
      <div className="p-8 bg-gray-100 flex gap-10">
        <div className="w-3/4">
          {timeRemaining !== null && (
            <div className="text-red-500 font-bold text-xl mb-4 ">
              Time Remaining: {formatTime(timeRemaining)}
            </div>
          )}
  
          {mcqs && mcqs.length > 0 && (
            <McqComponent
              mcq={mcqs[currentQuestionIndex]}
              updateAnswer={updateAnswer}
              mcqAnswers={mcqAnswers}
            />
          )}
        </div>
  
        {mcqs && mcqs.length > 0 && (
          <McqSidebar
            mcqAnswers={mcqAnswers}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={mcqs.length}
            handleQuestionClick={handleQuestionClick}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        )}
      </div>
    );
  }