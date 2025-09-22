import { NavLink } from "react-router";
import { twJoin } from "tailwind-merge";

interface NavItemProps {
  title: string;
  to: string;
}

export const NavItem = ({ title, to }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        twJoin(
          "flex h-10 items-center justify-center whitespace-nowrap px-2 text-center text-sm",
          isActive
            ? "border-b-[2px] border-[#125497] font-bold text-[#125497]"
            : "text-[#8DA5BF] hover:text-[#125497]",
        )
      }
    >
      {title}
    </NavLink>
  );
};
