async function sendMCQs(apiUrl, testId, password, questionsArray) {
    try {
      for (const questionObj of questionsArray) {
        const formData = new FormData();
        formData.append("testId", testId);
        formData.append("password", password);
        formData.append("question", questionObj.question);
        formData.append("option1", questionObj.option1);
        formData.append("option2", questionObj.option2);
        formData.append("option3", questionObj.option3);
        formData.append("option4", questionObj.option4);
        formData.append("answer", questionObj.answer);
        formData.append("marks", questionObj.marks);
  
        // If there's an image in questionObj, add it
        if (questionObj.image) {
          formData.append("image", questionObj.image);
        }
  
        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });
  
        const result = await response.json();
        if (!result.success) {
          console.error("Error sending question:", result.message);
        } else {
          console.log("MCQ sent successfully:", result.data);
        }
      }
      console.log("All questions processed.");
    } catch (error) {
      console.error("Error sending MCQs:", error);
    }
  }

  const questions = [
    {
      "question": "One of the important contributions of feminism is the dignity and value it brings to the role of women in society. In an equal society, there is no essential difference between the roles of men and women in professional or domestic spheres; both are equally important and equally valuable. Feminism argues that social equality, rather than gender, should be the foundation for determining a person’s worth and place in society. The passage best supports the statement that:",
      "option1": "Feminism determines the social status of individuals.",
      "option2": "Gender roles are social constructs.",
      "option3": "Women's roles have inherent dignity and value.",
      "option4": "All individuals, regardless of gender, are born equal.",
      "option5": "Feminism is a great leveller of society.",
      "answer": "Women's roles have inherent dignity and value.",
      "marks": 4
    },
    {
      "question": "What is the speed of the current?",
      "option1": "I and II only",
      "option2": "I and III only",
      "option3": "All I, II, and III",
      "option4": "II and III only",
      "answer": "All I, II, and III",
      "marks": 4
    },
    {
      "question": "What is the sum of the present ages of Raj and Priya?",
      "option1": "I and III only",
      "option2": "II and III only",
      "option3": "All I, II, and III",
      "option4": "Any two of the three",
      "answer": "All I, II, and III",
      "marks": 4
    },
    {
      "question": "A merchant has 800 kg of wheat, part of which he sells at 12% profit and the rest at 20% profit. He gains 16% on the whole. The quantity sold at 20% profit is:",
      "option1": "400 kg",
      "option2": "500 kg",
      "option3": "600 kg",
      "option4": "480 kg",
      "answer": "500 kg",
      "marks": 4
    },
    {
      "question": "How many distinct prime factors are there in 5040?",
      "option1": "5",
      "option2": "6",
      "option3": "4",
      "option4": "3",
      "answer": "5",
      "marks": 4
    },
    {
      "question": "In a certain code language, 'BANANA' is coded as 'CNOBNB'. How is 'CHERRY' coded in that language?",
      "option1": "DJFSUZ",
      "option2": "DIFYRZ",
      "option3": "DHFSAZ",
      "option4": "DKGTAZ",
      "answer": "DJFSUZ",
      "marks": 4
    },
    {
      "question": "A rectangle with sides in the ratio 4:5 has its length and width increased by 15% and 20%, respectively. By what percentage does its area increase?",
      "option1": "38%",
      "option2": "40%",
      "option3": "44%",
      "option4": "48%",
      "answer": "44%",
      "marks": 4
    },
    {
      "question": "A shopkeeper has two types of coffee beans. The first type costs $8 per kg, and the second type costs $12 per kg. To create a 40 kg blend that costs $9.50 per kg, how many kilograms of each type should he use?",
      "option1": "30 kg of the first and 10 kg of the second",
      "option2": "25 kg of the first and 15 kg of the second",
      "option3": "20 kg of each type",
      "option4": "10 kg of the first and 30 kg of the second",
      "answer": "25 kg of the first and 15 kg of the second",
      "marks": 4
    },
    {
      "question": "A grocer mixes two kinds of grains, one costing $6 per kg and the other costing $10 per kg, to create a 20 kg mixture worth $7.50 per kg. How much of each grain did he use?",
      "option1": "10 kg of each type",
      "option2": "12 kg of $6 grain and 8 kg of $10 grain",
      "option3": "8 kg of $6 grain and 12 kg of $10 grain",
      "option4": "14 kg of $6 grain and 6 kg of $10 grain",
      "answer": "12 kg of $6 grain and 8 kg of $10 grain",
      "marks": 4
    },
    {
      "question": "The side of a cube is increased by 15%. By what percentage does the volume increase?",
      "option1": "52%",
      "option2": "50%",
      "option3": "48%",
      "option4": "45%",
      "answer": "50%",
      "marks": 4
    },
    {
      "question": "If 6 workers can build a fence in 12 hours, how many hours will it take 9 workers to build the same fence?",
      "option1": "6 hours",
      "option2": "8 hours",
      "option3": "9 hours",
      "option4": "10 hours",
      "answer": "8 hours",
      "marks": 4
    },
    {
      "question": "A man is three times as old as his daughter. In five years, their combined age will be 80. What is the man's current age?",
      "option1": "45",
      "option2": "50",
      "option3": "55",
      "option4": "60",
      "answer": "60",
      "marks": 4
    },
    {
      "question": "A cistern can be filled by one pipe in 12 hours and emptied by another pipe in 15 hours. How long will it take to fill the cistern if both pipes are opened together?",
      "option1": "30 hours",
      "option2": "60 hours",
      "option3": "20 hours",
      "option4": "25 hours",
      "answer": "30 hours",
      "marks": 4
    },
    {
      "question": "A milk vendor has two containers. In the first container, the milk-to-water ratio is 4:1, and in the second container, it is 2:1. How much milk should he take from each container to make a 10-liter mixture with a milk-to-water ratio of 3:1?",
      "option1": "6 liters from the first, 4 liters from the second",
      "option2": "5 liters from each",
      "option3": "7 liters from the first, 3 liters from the second",
      "option4": "3 liters from the first, 7 liters from the second",
      "answer": "6 liters from the first, 4 liters from the second",
      "marks": 4
    },
    {
      "question": "Find the smallest positive integer n such that n + 4 is divisible by 6 and n + 3 is divisible by 4.",
      "option1": "10",
      "option2": "12",
      "option3": "18",
      "option4": "16",
      "answer": "12",
      "marks": 4
    },
    {
      "question": "Which of the following statements about pointers in C is correct?",
      "option1": "The & operator is used to get the address of a variable.",
      "option2": "The * operator is used to get the address of a pointer variable.",
      "option3": "NULL is a keyword that denotes a valid pointer address.",
      "option4": "Pointers can only point to variables of the same type.",
      "answer": "The & operator is used to get the address of a variable.",
      "marks": 4
    }
  ];
  
const apiUrl = "https://examportal.acmtiet.com/api/admin/mcq";
const testId = "cm2o6dsk40002ecvjoslj09vw";
const password = "examportal@naman";

sendMCQs(apiUrl, testId, password, questions);