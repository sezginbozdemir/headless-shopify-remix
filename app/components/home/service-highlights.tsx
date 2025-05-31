import { Metaobject } from "@/lib/shopify/types";

export function ServiceHighlights({ services }: { services: Metaobject[] }) {
  return (
    <section className="py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => {
          const title = service.fields.find((f) => f.key === "title")?.value;
          const text = service.fields.find((f) => f.key === "text")?.value;
          const imageUrl = service.fields.find((f) => f.key === "icon")
            ?.reference?.image?.url;

          return (
            <div
              key={service.handle}
              className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex-shrink-0">
                <div className="p-3 bg-primary/10 rounded-full">
                  <img src={imageUrl} alt={title || ""} className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-500">{text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
