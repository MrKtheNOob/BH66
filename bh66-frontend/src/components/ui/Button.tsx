import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
  children?: ReactNode;
};

export default function Button({
  children,
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`
        ${fullWidth ? "w-full" : "px-5"}
        py-2 rounded-lg font-medium 
        bg-yellow-500 text-black 
        hover:bg-yellow-400 transition
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}