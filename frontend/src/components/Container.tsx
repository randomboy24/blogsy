"use client";
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`max-w-5xl mx-auto p-4 md:p-10 bg-neutral-100 h-screen ${className}`}
    >
      {children}
    </div>
  );
}
