import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (session) {
    return NextResponse.json(
      { error: "You are not logged in" },
      { status: 401 }
    );
  }
  return NextResponse.json({ session });
}
