import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "bg-brand-surface-default text-greyscale-text-negative hover:bg-brand-surface-op-sub disabled:bg-brand-surface-disabled disabled:text-greyscale-text-disabled",
        destructive:
          "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost:
          "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
        blue: "bg-blue-50 text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        vault:
          "md:h-12 rounded-xl w-full md:text-base text-sm max-w-[400px]  min-[500px]:min-w-[358px] py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

const PrimaryButton = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & ButtonProps) => {
  return (
    <Button
      className={cn(
        "!bg-brand-surface-default !text-greyscale-text-negative hover:!bg-primary-300 dark:hover:!bg-primary-400 !h-8 min-h-[36px] w-full !max-w-[136px] rounded-lg px-4 py-2 text-sm lg:!max-w-[180px]",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

const SecondaryButton = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string } & ButtonProps) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "!bg-brand-surface-super-subtle !text-brand-text-title border-brand-border-subtle hover:!bg-primary-50 dark:hover:!bg-primary-850 hover:border-primary-500 dark:hover:!border-primary-500 !h-9 w-full !max-w-[136px] rounded-lg border px-4 py-2 text-sm dark:border-[#0D4072] lg:!max-w-[180px]",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export { Button, buttonVariants, PrimaryButton, SecondaryButton };
