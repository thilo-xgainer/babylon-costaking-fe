import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export const Content = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <main
    className={twMerge(
      "mx-auto dark:bg-[#15202B] max-lg:w-full md:mx-auto lg:w-[1010px]",
      className,
    )}
  >
    {children}
  </main>
);
