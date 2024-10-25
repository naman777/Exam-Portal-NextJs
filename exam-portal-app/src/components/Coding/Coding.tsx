import { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";

interface CodingQuestion {
  id: number;
  title: string;
  description: string;
  sampleTestCase: string;
  sampleTestCaseOutput: string;
  marks: number;
  difficulty: string;
}

const languages: { [key: string]: string } = {
  c: '#include <stdio.h>\nint main() {\n  printf("Hello, World!");\n  return 0;\n}',
  cpp: '#include <iostream>\nint main() {\n  std::cout << "Hello, World!";\n  return 0;\n}',
  python: "print('Hello, World!')",
  javascript: "console.log('Hello, World!');",
};

interface CodingPageProps {
  question: CodingQuestion;
  currentCode: string;
  setCurrentCode: (code: string) => void;
}

export default function CodingPage({ question, currentCode, setCurrentCode }: CodingPageProps) {
  const [language, setLanguage] = useState("c");

  // Sync the code when the language changes
  useEffect(() => {
    if (!currentCode) {
      setCurrentCode(languages[language as keyof typeof languages]);
    }
  }, [language, currentCode, setCurrentCode]);

  const handleRunCode = async () => {
    // API call to run code
    console.log("Code submitted for running:", currentCode);
    // Placeholder for an API call to run the code
  };

  const handleSubmitCode = async () => {
    // API call to submit code
    console.log("Code submitted:", currentCode);
    // Placeholder for an API call to submit the code
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    // Update the editor with the default code for the selected language
    setCurrentCode(languages[selectedLang as keyof typeof languages]);
  };

  return (
    <div className="p-4 bg-gray-100">
      <div className=" mx-auto bg-white shadow-lg rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{question.title}</h1>
          <div>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleRunCode}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Run
              </button>
              <button
                onClick={handleSubmitCode}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
          </div>
        </div>

        {/* Question Description */}
        <div className="mt-4">
          <h3 className="font-semibold">Description:</h3>
          <p className="text-gray-700">{question.description}</p>
        </div>

        {/* Sample Test Case */}
        <div className="mt-4">
          <h3 className="font-semibold">Sample Test Case:</h3>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
            {question.sampleTestCase}
          </pre>
          <h3 className="font-semibold mt-2">Expected Output:</h3>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">
            {question.sampleTestCaseOutput}
          </pre>
        </div>

        {/* Code Editor */}
        <div className="mt-6">
          <Editor
            height="70vh"
            language={language}
            value={currentCode}
            onChange={(value) => setCurrentCode(value || "")}
            theme="vs-dark"
          />
        </div>
      </div>
    </div>
  );
}
