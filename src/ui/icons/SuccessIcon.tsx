import { SVGProps } from "react";

interface ArrowProps extends SVGProps<SVGElement> {
  strokeColor?: string;
}

export const SuccessIcon = ({
  strokeColor = "currentColor",
  ...props
}: ArrowProps) => {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
    >
      <path
        d="M10 36L24 50L56 18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
