import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { LoginForm } from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Owner Sign In",
  description: "Sign in to the Caleb Animal Care pet owner portal.",
  robots: { index: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const session = await getServerSession(authOptions);
  if (session) redirect("/my-pets");

  return (
    <div className="grid min-h-[70vh] place-items-center bg-mist px-5 py-14">
      <LoginForm callbackUrl={searchParams.callbackUrl ?? "/my-pets"} />
    </div>
  );
}
