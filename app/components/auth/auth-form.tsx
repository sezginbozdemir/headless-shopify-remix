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
    { name: "password", placeholder: "password", type: "password" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "phone", placeholder: "Phone", type: "text" },
    {
      name: "acceptsMarketing",
      placeholder: "Accept Marketing",
      type: "checkbox",
    },
  ];

  const loginFields = [
    { name: "email", placeholder: "Email", type: "email" },
    { name: "password", placeholder: "Password", type: "password" },
  ];
  const navigate = useNavigate();

  const toggleMode = () => {
    navigate(`/account/auth?mode=${mode === "login" ? "signup" : "login"}`);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        {mode === "signup" ? "Sign Up" : "Login"}
      </h1>

      <Form method="post">
        {(mode === "signup" ? signupFields : loginFields).map((field) => (
          <FormField key={field.name} field={field} />
        ))}
        <Button type="submit">
          {mode === "signup" ? "Register" : "Login"}
        </Button>
      </Form>
      <Button variant="link" onClick={toggleMode} className="mt-4 p-0 text-sm">
        {mode === "login"
          ? "Don't have an account? Sign up"
          : "Already have an account? Log in"}
      </Button>
    </div>
  );
}
