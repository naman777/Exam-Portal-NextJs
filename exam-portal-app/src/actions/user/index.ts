"use server";

import prisma from "../../../lib/db";

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
            }
        },
        testApplied: true,
        testGiven: true,
        testSubmitted: true,
        marks: true,
        createdAt: true,
      }
    });

    return user;
  } catch (error) {
    return null;
  }
};

export const getTests = async () => {
    try {
        
        const tests = await prisma.test.findMany({
            select:{
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
                    }
                }
            }
        })

        return tests;

    } catch (error) {
        
    }
}