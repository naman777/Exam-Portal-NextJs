"use client";
import React, { useState, useEffect } from "react";
import McqComponent, { Mcq } from "../../../components/Test/McqComponent";
import McqSidebar from "../../../components/Test/McqSidebar";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { checkForTest, handleTestSubmit } from "@/actions/user";
import { set } from "date-fns";
import CodingPage from "@/components/Coding/Coding";

interface McqFortest {
  id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  marks: number;
}

interface CodingQuestion {
  id: number;
  title: string;
  description: string;
  sampleTestCase: string;
  sampleTestCaseOutput: string;
  marks: number;
  difficulty: string;
}

export default function Home() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("mcqanswers") || "{}");
    }
    return {};
  });
  const [answeredQuestion, setAnsweredQuestions] = useState<Record<number, boolean>>(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("answeredQuestion") || "{}");
    }
    return {};
  });
  
  const updateAnsweredQuestions = (questionIndex: number) => {
    const updatedAnswers = { ...answeredQuestion, [questionIndex]: true };
    setAnsweredQuestions(updatedAnswers);
    localStorage.setItem("answeredQuestion", JSON.stringify(updatedAnswers));
  };
  

  const [mcqs, setMcqs] = useState<Mcq[]>([]);
  const [CodingQuestions, setCodingQuestions] = useState<CodingQuestion[]>([]); // Coding questions
  const [showCoding, setShowCoding] = useState(false); // Toggle between MCQ and coding
  const [currentCode, setCurrentCode] = useState(""); // For storing current code
  const [codingQuestionIndex, setCodingQuestionIndex] = useState(0); // Index for coding questions
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const { data: session } = useSession();
  const email = session?.user?.email;
  const router = useRouter();
  const [warning, setWarning] = useState(0);

  useEffect(() => {
    const fetchTestData = async () => {
      if (!session || !email) {
        toast.error("You are not logged in");
        router.push("/");
      }

      const res = await checkForTest(email as string); // Fetch test data from API
      if (!res.success) {
        toast.error(res.message);
        router.push("/dashboard");
      } else {
        toast.success("You can give the test now");
        setMcqs(res.testSlot?.mcqs as Mcq[]); // Set MCQ questions
        setCodingQuestions(res.testSlot?.codingQuestions as CodingQuestion[]); // Set coding questions
        const end = res.testSlot?.endTime
          ? new Date(res.testSlot.endTime)
          : new Date();
        setEndTime(end);

        // Calculate the remaining time with 5 minutes buffer
        const remainingTime = (end.getTime() - Date.now()) / 1000 - 5 * 60;
        setTimeRemaining(remainingTime);
      }
    };
    fetchTestData();

    document.documentElement.requestFullscreen();

    // Request camera and microphone permissions
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .catch(() => {
        toast.error("Camera and mic permissions denied");
        toast.error(
          "Redirecting to dashboard now allow camera and mic permissions externally to continue"
        );
        router.push("/dashboard");
      });

    // Disable copy and paste
    document.addEventListener("copy", preventCopy);
    document.addEventListener("paste", preventCopy);
    document.addEventListener("contextmenu", preventCopy); // Disable right-click

    // Detect tab switch
    const handleVisibilityChange = () => {
      if (document.hidden) {
        sendTabSwitchAlert();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("paste", preventCopy);
      document.removeEventListener("contextmenu", preventCopy);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session, email]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        toast.error(
          "Return to full screen by pressing F11 or you will be redirected to the dashboard in 10 seconds"
        );
        const timeout = setTimeout(() => {
          if (!document.fullscreenElement) {
            router.push("/dashboard");
          }
        }, 10000);

        const handleKeydown = (e: KeyboardEvent) => {
          if (e.key === "F11") {
            clearTimeout(timeout);
            document.documentElement.requestFullscreen();
          }
        };

        document.addEventListener("keydown", handleKeydown);

        return () => {
          clearTimeout(timeout);
          document.removeEventListener("keydown", handleKeydown);
        };
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const preventCopy = (e: Event) => {
    e.preventDefault();
    toast.error("Copying is not allowed");
  };

  const sendTabSwitchAlert = async () => {
    console.log("Tab switched");
    setWarning((prev) => prev + 1);
    toast.error("Do not switch tabs during the test");
  };

  useEffect(() => {
    if (timeRemaining === null) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev && prev > 1) {
          return prev - 1;
        } else {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const handleAutoSubmit = async () => {
    toast.error("Time is up. Test will be submitted automatically");
    
    const res = await handleTestSubmit(
      session!.user!.email!,
      mcqAnswers,
      warning
    );
    localStorage.removeItem("mcqanswers");
    localStorage.removeItem("answeredQuestion");
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
    return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(
      2,
      "0"
    )}`;
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleCodingQuestionClick = (index: number) => {
    setCodingQuestionIndex(index);
  };

  const handlePrev = () => {
    if (showCoding) {
      if (codingQuestionIndex > 0) {
        setCodingQuestionIndex((prev) => prev - 1);
      }
    } else {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1);
      }
    }
  };

  const handleNext = () => {
    if (showCoding) {
      if (codingQuestionIndex < CodingQuestions.length - 1) {
        setCodingQuestionIndex((prev) => prev + 1);
      }
    } else {
      if (currentQuestionIndex < mcqs.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }
  };

  const updateAnswer = (questionId: number, answer: string) => {
    const newAnswers = { ...mcqAnswers, [questionId]: answer };
    setMcqAnswers(newAnswers);
    localStorage.setItem("mcqanswers", JSON.stringify(newAnswers));
  };

  

  const toggleSection = () => {
    setShowCoding((prev) => !prev); // Toggle between MCQ and Coding
  };

  return (
    <div className="p-8 bg-gray-100 flex gap-10">
      <div className="w-3/4">
        {timeRemaining !== null && (
          <div className="text-red-500 font-bold text-xl mb-4 ">
            Time Remaining: {formatTime(timeRemaining)}
          </div>
        )}

        {/* Toggle Button for MCQ and Coding */}
        {/* <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setShowCoding(false)}
            className={`px-4 py-2 font-bold ${
              !showCoding
                ? "bg-lightblue text-white"
                : "bg-white text-lightblue"
            } border border-lightblue rounded-md`}
          >
            MCQ
          </button>
          <button
            onClick={() => setShowCoding(true)}
            className={`px-4 py-2 font-bold ${
              showCoding ? "bg-lightblue text-white" : "bg-white text-lightblue"
            } border border-lightblue rounded-md`}
          >
            Coding
          </button>
        </div> */}

        { mcqs &&
            mcqs.length > 0 && (
              <McqComponent
                mcq={mcqs[currentQuestionIndex]}
                updateAnswer={updateAnswer}
                mcqAnswers={mcqAnswers}
                updateAnsweredQuestions={updateAnsweredQuestions}
                questionIndex={currentQuestionIndex}
              />
            )
          }
      </div>

      {mcqs && mcqs.length > 0 && (
        <McqSidebar
          mcqAnswers={mcqAnswers}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={mcqs.length}
          handleQuestionClick={handleQuestionClick}
          handlePrev={handlePrev}
          handleNext={handleNext}
          showCoding={showCoding} // Toggle state passed to sidebar
          codingQuestions={CodingQuestions.length}
          currentCode={currentCode}
          setCurrentCode={setCurrentCode}
          codingQuestionIndex={codingQuestionIndex}
          handleCodingQuestionClick={handleCodingQuestionClick}
          warning={warning}
          answeredQuestion={answeredQuestion}
        />
      )}
    </div>
  );
}
