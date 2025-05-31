import { getPage } from "@/lib/shopify";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
export const loader: LoaderFunction = async ({ params }) => {
  const handle = params.page;
  if (!handle) {
    throw new Response("Error no handle", { status: 400, statusText: "error" });
  }
  const req = await getPage(handle);
  if (!req.success) {
    throw new Response(req.error, {
      status: 500,
      statusText: "Failed to fetch page, please try again later.",
    });
  }
  const page = req.result;
  if (!page) {
    throw new Response("Page not found", {
      status: 404,
      statusText: "Not found",
    });
  }
  return { page };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.page) return [];
  const { page } = data;
  return [
    { title: page.seo?.title || page.title },
    { name: "description", content: page.seo?.description || "Read more." },
  ];
};
export default function ShopifyPage() {
  const { page } = useLoaderData<typeof loader>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="prose">
        <h1>{page?.title}</h1>
        <div>Loading content...</div>
      </div>
    );
  }

  return (
    <main className="prose flex flex-col gap-5">
      <h1 className="text-3xl">{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.body }} />
    </main>
  );
}
