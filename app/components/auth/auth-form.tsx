import { Form, useNavigate } from "@remix-run/react";
import { FormField } from "./form-field";
import { Button } from "../ui/button";
interface Props {
  mode: string;
}

export function AuthForm({ mode }: Props) {
  const signupFields = [
    { name: "firstName", placeholder: "First Name", type: "text" },
    { name: "lastName", placeholder: "Last Name", type: "text" },
    {
      name: "password",
      placeholder: "Password",
      type: "password",
      required: true,
    },
    { name: "email", placeholder: "Email", type: "email", required: true },
    { name: "phone", placeholder: "Phone", type: "text" },
    {
      name: "acceptsMarketing",
      placeholder: "Accept Marketing",
      type: "checkbox",
      required: true,
    },
  ];

  const loginFields = [
    { name: "email", placeholder: "Email", type: "email", required: true },
    {
      name: "password",
      placeholder: "Password",
      type: "password",
      required: true,
    },
  ];
  const recoverFields = [
    { name: "email", placeholder: "Email", type: "email", required: true },
  ];

  const navigate = useNavigate();

  const toggleMode = () => {
    navigate(`/account/auth?mode=${mode === "login" ? "signup" : "login"}`);
  };

  return (
    <div className="flex justify-between items-start">
      <div className="h-full flex-1 overflow-hidden rounded-md">
        <img
          src="/account.jpg"
          className="w-full h-full object-cover"
          alt="login/signup"
        />
      </div>

      <div className="w-full flex flex-col flex-1 items-start  px-[5rem] ">
        <Form method="post" className="w-full">
          {(mode === "signup"
            ? signupFields
            : mode === "recover"
            ? recoverFields
            : loginFields
          ).map((field) => (
            <FormField key={field.name} field={field} />
          ))}
          <Button className="w-[150px] h-[50px]" type="submit">
            {mode === "recover"
              ? "Recover"
              : mode === "signup"
              ? "Register"
              : "Login"}
          </Button>
        </Form>
        <div className="flex justify-between items-center w-full">
          <Button
            variant="link"
            onClick={toggleMode}
            className="mt-4 p-0 text-md"
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </Button>
          <Button
            variant="link"
            onClick={() => navigate(`/account/auth?mode=recover`)}
            className="mt-4 p-0 text-md"
          >
            {mode === "login" ? "Forgot password?" : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}
