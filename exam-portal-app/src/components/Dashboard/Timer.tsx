"use state";
import { useState, useEffect } from "react";

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
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-lg font-bold">Your exam begins in:</h1>
      <div className="flex space-x-4">
        <div className="flex flex-col items-center bg-blue-500 text-white p-4 rounded-md">
          <span className="text-3xl font-semibold">{timeLeft.hours}</span>
          <span>Hours</span>
        </div>
        <div className="flex flex-col items-center bg-blue-500 text-white p-4 rounded-md">
          <span className="text-3xl font-semibold">{timeLeft.minutes}</span>
          <span>Minutes</span>
        </div>
        <div className="flex flex-col items-center bg-blue-500 text-white p-4 rounded-md">
          <span className="text-3xl font-semibold">{timeLeft.seconds}</span>
          <span>Seconds</span>
        </div>
      </div>
      <button
        disabled={!isClickable}
        className={`px-6 py-2 rounded-md ${isClickable ? 'bg-gray-500 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'}`}
      >
        Start Test
      </button>
    </div>
  );
};

export default Timer;
