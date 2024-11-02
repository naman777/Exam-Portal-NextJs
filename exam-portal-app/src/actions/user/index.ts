"use server";
import prisma from "../../../lib/db";
import redis from "../../../lib/redisClient";

export async function isUserExist(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      await prisma.user.create({
        data: {
          email: email,
        },
      });
    }

    if (user?.signUp) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export const getUserDetails = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        rollNo: true,
        branch: true,
        phone: true,
        imageurl: true,
        signUp: true,
        testSlotId: true,
        testSlot: {
          select: {
            id: true,
            timeSlot: true,
            endTime: true,
          },
        },
        testApplied: true,
        testGiven: true,
        testSubmitted: true,
        marks: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const getTests = async () => {
  try {
    const tests = await prisma.test.findMany({
      select: {
        id: true,
        name: true,
        date: true,
        testSlots: {
          select: {
            id: true,
            timeSlot: true,
            endTime: true,
            usersAllowed: true,
            totalMarks: true,
            usersFilled: true,
          },
        },
      },
    });

    return tests;
  } catch (error) {}
};

export const applyForTestSlot = async (testSlotId: string, email: string) => {
  try {
    const test = await prisma.testSlot.findUnique({
      where: {
        id: testSlotId,
      },
    });

    if(!test){
      return {
        success: false,
        message: "Test slot not found"
      };
    }

    if(test.usersFilled >= test.usersAllowed){
      return {
        success: false,
        message: "Test slot is full. Apply for another slot"
      };
    }

    if(test.timeSlot < new Date()){
      return {
        success: false,
        message: "Test slot time has passed"
      }
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if(!user){
      return {
        success: false,
        message: "User not found"
      };
    }

    if(user.testApplied || user.testGiven){
      return {
        success: false,
        message: "You have already applied for a test slot"
      };
    }

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        testSlotId: testSlotId,
        testApplied: true,
      },
    });

    await prisma.testSlot.update({
      where: {
        id: testSlotId,
      },
      data: {
        usersFilled: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
      message: "Test slot applied successfully!"
    };

  } catch (error) {
    return {
      success: false,
      message: "Something went wrong."
    };
  }
};

export const checkForTest = async (email: string) => {
  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (user.testGiven || user.testSubmitted) {
      return {
        success: false,
        message: "You have already given the test",
      };
    }

    if (!user.testApplied) {
      return {
        success: false,
        message: "You have not applied for the test",
      };
    }

    const cacheKey = `testSlotforUser:${user.testSlotId}`;
    const cachedTestSlot = await redis.get(cacheKey);

    let testSlot;

    if (cachedTestSlot) {
      console.log("Using cached test slot");
      testSlot = JSON.parse(cachedTestSlot);
    } else {
      testSlot = await prisma.testSlot.findUnique({
        where: {
          id: user.testSlotId!,
        },
        select: {
          id: true,
          timeSlot: true,
          endTime: true,
          mcqs: {
            select: {
              id: true,
              question: true,
              option1: true,
              option2: true,
              option3: true,
              option4: true,
              marks: true,
            },
          },
          codingQuestions: {
            select: {
              id: true,
              title: true,
              description: true,
              sampleTestCase: true,
              sampleTestCaseOutput: true,
              marks: true,
              difficulty: true,
            },
          },
        },
      });

      if (!testSlot) {
        return {
          success: false,
          message: "Test slot not found",
        };
      }

      await redis.set(cacheKey, JSON.stringify(testSlot), 'EX', 3600); 
    }

    const now = new Date();
    if (testSlot.timeSlot > now) {
      return {
        success: false,
        message: "Test slot time has not come yet",
      };
    }

    if (testSlot.endTime < now) {
      return {
        success: false,
        message: "Test slot time has passed",
      };
    }

    return {
      success: true,
      message: "You can give the test now",
      testSlot,
    };

  } catch (error) {
    console.error("Error checking for test:", error);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};


export const handleTestSubmit = async (
  email: string, 
  mcqAnswers: Record<string, string>, 
  warnings: number
) => {

  try {
    // Fetch user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (!user.testApplied) {
      return {
        success: false,
        message: "You have not applied for the test",
      };
    }

    if (user.testSubmitted) {
      return {
        success: false,
        message: "You have already submitted the test",
      };
    }

    const cacheKey = `testSlotforAnswer:${user.testSlotId}`;

    // Check if test slot data is cached
    let testSlot = await redis.get(cacheKey);
    if (testSlot) {
      console.log("Using cached test slot");
      testSlot = JSON.parse(testSlot);
    } else {
      console.log("Fetching test slot from DB");
      //@ts-ignore
      testSlot = await prisma.testSlot.findUnique({
        where: { id: user.testSlotId! },
        select: {
          id: true,
          mcqs: {
            select: {
              id: true,
              answer: true,
              marks: true,
            },
          },
        },
      });

      if (!testSlot) {
        return {
          success: false,
          message: "Test slot not found",
        };
      }

      await redis.set(cacheKey, JSON.stringify(testSlot), 'EX', 3600);
    }
    let userMarks = 0;
    //@ts-ignore
    const mcqs = testSlot.mcqs;
    console.log(mcqAnswers);
    console.log(mcqs);
    mcqs.forEach((mcq:any) => {
      const answerId = mcq.id.toString();
      if (answerId in mcqAnswers) {
        const userAnswer = mcqAnswers[answerId];
        console.log(userAnswer);
        console.log(mcq.answer);
        if (userAnswer === mcq.answer) {
          userMarks += mcq.marks;
        }
        console.log(userMarks);
      }
    });

    // Update marks and submission status in the database
    await prisma.user.update({
      where: { email },
      data: {
        testSubmitted: true,
        marks: userMarks,
        testGiven: true,
        warnings: warnings,
      },
    });

    return {
      success: true,
      message: "Test submitted successfully",
      userMarks,
    };
  } catch (error) {
    console.error(error); // Log error for debugging
    return {
      success: false,
      message: "An error occurred while submitting the test",
    };
  }
};


export const getLeaderboard = async () => {
  try {
    const users = await prisma.user.findMany({
      where:{
        testGiven: true,
        testSubmitted: true
      },
      select: {
        email: true,
        name: true,
        marks: true,
        rollNo: true,
      },
    })

    return {
      success: true,
      users
    }


  } catch (error) {
    return {
      success: false,
      message: "Something went wrong"
    }
  }
}