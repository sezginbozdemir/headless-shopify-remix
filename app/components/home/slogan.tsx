interface Props {
  slogan: string;
}

export function Slogan({ slogan }: Props) {
  if (!slogan) return null;

  return (
    <div className="relative overflow-hidden text-gray-300 h-40 flex items-center">
      <div
        className="flex whitespace-nowrap animate-marquee"
        style={{ animationDuration: `20s` }}
      >
        {[slogan].concat(slogan).map((text, index) => (
          <h2 key={index} className="mx-8 font-medium text-9xl">
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
