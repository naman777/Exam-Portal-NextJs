import React from "react";

interface CodingQuestion {
  id: number;
  title: string;
  description: string;
  sampleTestCase: string;
  sampleTestCaseOutput: string;
  marks: number;
  difficulty: string;
}

interface LeftPaneProps {
  problem: CodingQuestion;
}

const ProblemStatement: React.FC<LeftPaneProps> = ({ problem }) => {
  return (
    <div className="w-[35%] h-full text-black p-6 overflow-y-auto bg-white rounded-xl ml-12 shadow-2xl">
      <div className="text-4xl mb-4 font-extrabold">
        {problem.title}
      </div>
      <p className="mb-2 pt-6 font-bold text-2xl">Difficulty: {problem.difficulty}</p>
      <p className="text-xl mb-2 font-bold pt-5">Problem Description:</p>
      <p>{problem.description}</p>
      <p className="text-xl mb-2 font-bold mt-2">Sample Test Case:</p>
      <p>{problem.sampleTestCase}</p>
      <p className="text-lg mb-2 font-bold">Sample Test Case Answer:</p>
      <p>{problem.sampleTestCaseOutput}</p>
    </div>
  );
};

export default ProblemStatement;

