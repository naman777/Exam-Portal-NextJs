// app/solve/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProblemStatement from "@/components/Coding/LeftPanel";
import CodeEditor from "@/components/Coding/RightPanel";
import { useRouter } from "next/navigation";
import CodingPage from "@/components/Coding/Coding";

const boilerplateCodes = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() { \n  cout<<"Hello";\n}`,
  c: `#include <stdio.h>\n\nint main() { \n  printf("Hello");\n  return 0;\n}`,
  python: `print("Hello")`,
  java: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello");\n  }\n}`,
  javascript: `console.log("Hello");`,
};

const SolveProblemPage = ({ params }: { params: { id: string } }) => {
  const [problem, setProblem] = useState(null);
  const router = useRouter();

  

  return (
    <div className="">
      
    </div>
  );
};

export default SolveProblemPage;
