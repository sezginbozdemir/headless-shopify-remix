interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full h-full max-w-[1800px] px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
