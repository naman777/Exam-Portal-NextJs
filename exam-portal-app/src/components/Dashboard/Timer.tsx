"use state";
import { useState, useEffect } from "react";
import dots from "/public/dots.svg"
import Image from "next/image";

interface TimerProps {
  examDate: Date; // The date when the exam starts
}

const Timer: React.FC<TimerProps> = ({ examDate }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const difference = examDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(intervalId);
        setIsClickable(true);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [examDate]);

  return (
    <div className="flex flex-col items-center space-y-4 justify-center rounded-xl bg-white py-10 shadow-xl">
      <h1 className="text-2xl font-bold text-[#575757]">Your exam begins in:</h1>
      <div className="flex space-x-4">
        <div className="flex flex-col items-center bg-[#0BAADD] text-white p-4 rounded-md shadow-2xl">
          <span className="text-3xl font-semibold">{timeLeft.hours}</span>
          <span>Hours</span>
        </div>
        <Image src={dots} alt="dots" /> 
        <div className="flex flex-col items-center bg-[#0BAADD] text-white p-4 rounded-md shadow-2xl">
          <span className="text-3xl font-semibold">{timeLeft.minutes}</span>
          <span>Minutes</span>
        </div>
        <Image src={dots} alt="dots" /> 
        <div className="flex flex-col items-center bg-[#0BAADD] text-white p-4 rounded-md shadow-2xl">
          <span className="text-3xl font-semibold">{timeLeft.seconds}</span>
          <span>Seconds</span>
        </div>
      </div>
      <button
        disabled={!isClickable}
        className={`px-6 py-2 rounded-md  font-bold text-xl mr-4 ${isClickable ? 'bg-[#28AA38] cursor-pointer text-white' : 'bg-[#CDCDCD] cursor-not-allowed text-[#575757]'}`}
      >
        Start Test
      </button>
    </div>
  );
};

export default Timer;
