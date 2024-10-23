"use server"

import prisma from "../../../lib/db"

export async function isUserExist(email: string) {
    
    try {
        const user = await prisma.user.findUnique({
            where:{
                email: email
            }
        })

        if(!user){
            await prisma.user.create({
                data:{
                    email: email
                }
            })
        }

        if(user?.signUp){
            return true;
        }
        else{
            return false;
        }

    } catch (error) {
        return false;
    }
    
}
