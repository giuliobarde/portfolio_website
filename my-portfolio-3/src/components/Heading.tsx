import clsx from "clsx";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xl" | "lg" | "md" | "sm";
  children: React.ReactNode;
  className?: string;
};

export default function Heading({
  as: Comp = "h1",
  className,
  children,
  size = "lg",
}: HeadingProps) {
  return (
    <Comp
      className={clsx(
        "font-bold leading-tight tracking-tight text-slate-300",
        size === "xl" && "text-4xl md:text-7xl",
        size === "lg" && "text-3xl md:text-6xl",
        size === "md" && "text-2xl md:text-5xl",
        size === "sm" && "text-xl md:text-4xl",
        className,
      )}
    >
      <span className="code-bracket text-yellow-400/60">{"// "}</span>
      {children}
    </Comp>
  );
}