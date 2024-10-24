export interface Mcq {
  id: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  imageurl?: string;
  answer: string;
  marks: number;
  createdAt: Date;
  testId: string;
  test: TestSlot;
}

export interface CodingQuestion {
  id: string;
  title: string;
  description: string;
  sampleTestCase: string;
  sampleTestCaseOutput: string;
  testCases: string;
  testCasesOutput: string;
  marks: number;
  difficulty: string;
  createdAt: Date;
  testId: string;
  test: TestSlot;
}

export interface Test {
  id: string;
  name: string;
  date: Date;
  createdAt: Date;
  testSlots: TestSlot[];
}

export interface TestSlot {
  id: string;
  timeSlot: Date;
  endTime: Date;
  usersAllowed: number;
  totalMarks: number;
  testId: string;
  test: Test;
  usersFilled: number;
  noOfMcqs: number;
  noOfCodingQues: number;
  users: User[];
  mcqs: Mcq[];
  codingQuestions: CodingQuestion[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  rollNo?: string;
  branch?: string;
  phone?: string;
  imageurl?: string;
  signUp: boolean;
  testSlotId?: string;
  testSlot?: TestSlot | null;
  testApplied: boolean;
  testGiven: boolean;
  testSubmitted: boolean;
  marks: number;
  createdAt: Date;
}
