import {
  data,
  LoaderFunctionArgs,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {};

export default function Index() {
  return (
    <div>
      <div></div>
    </div>
  );
}
