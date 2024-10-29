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
sendMCQs(apiUrl, testId, password, question);