import { doSocialLogin } from "@/app/actions";
import { GoogleButton } from "./GoogleButton";

export default async function LoginForm() {
  return (
    <form action={doSocialLogin}>
      <GoogleButton 
      type="submit"
      name="action"
      value="google"
      />
    </form>
  );
}
