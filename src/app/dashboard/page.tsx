import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Logout from "@/components/Logout";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) redirect("/");

  return (
    <div className="flex flex-col items-center m-4">
      <h1>Hello, {session?.user?.name}. This is your dashboard</h1>
      <Logout />
    </div>
  );
}
