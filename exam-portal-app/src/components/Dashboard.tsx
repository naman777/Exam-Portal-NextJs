"use client"
import { signIn, useSession } from "next-auth/react";

const Dashboard = () => {    

    const {data: session, status} = useSession();

    return (
        <div>
            {session ? (
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome {session?.user?.name}</p>
                    {JSON.stringify(session)}
                </div>
            ):(
                <div>
                    <h1>Dashboard</h1>
                    <p>You are not logged in</p>
                    <button className="bg-black p-2 text-white font-bold text-xl rounded-lg hover:bg-gray-950 " onClick={()=> signIn("google")}>Sign in with Google</button>
                </div>
            )}
        </div>
    )
}

export default Dashboard;   