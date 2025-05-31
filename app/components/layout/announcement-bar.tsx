interface Props {
  announcements: string[];
}

export function AnnouncementBar({ announcements }: Props) {
  if (announcements.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-gray-900 text-white h-10 flex items-center">
      <div
        className="flex whitespace-nowrap animate-marquee"
        style={{ animationDuration: `${announcements.length * 6}s` }}
      >
        {announcements.concat(announcements).map((text, index) => (
          <h2 key={index} className="mx-8 font-semibold uppercase">
            {text}
          </h2>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation-name: marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
