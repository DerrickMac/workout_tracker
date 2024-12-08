"use server";

import { signIn, signOut } from "@/auth";

export async function doSocialLogin(formData: FormData) {
  const action = formData.get("action") as string;
  if (action) {
    await signIn(action, { redirectTo: "/dashboard" });
  } else {
    console.warn("no action provided in formData.");
  }
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}
