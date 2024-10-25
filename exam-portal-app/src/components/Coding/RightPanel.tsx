// components/CodeEditor.tsx
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Code } from "lucide-react";

interface CodeEditorProps {
  boilerplateCodes: { [key: string]: string };
}

const CodeEditor: React.FC<CodeEditorProps> = ({ boilerplateCodes }) => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(boilerplateCodes["cpp"]);
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = () => {};

  return (
    <div className="w-[60%] h-full p-6 text-white ml-5">
      <div className="flex items-center text-2xl mb-4 mx-5">
        <Code className="mr-2 text-black" />
        <span className="text-black font-bold">Code</span>
        <select
          className="mx-3 border rounded-lg px-2 py-2 bg-white text-black"
          value={language}
          onChange={(e) => {
            const selectedLanguage = e.target.value;
            setLanguage(selectedLanguage);
            setCode(boilerplateCodes[selectedLanguage]);
          }}
        >
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>
        <button
          className="mx-5 rounded bg-green-600 px-4 py-2 hover:bg-green-900"
          onClick={handleRun}
        >
          Run
        </button>
        <button
          className="mx-2 rounded bg-green-600 px-4 py-2 hover:bg-green-900"
          onClick={handleRun}
        >
          Submit
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Editor
          height="calc(100vh - 128px)"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value ?? "")}
          options={{ fontSize: 20 }}
        />
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
