import { type PropsWithChildren, type ReactNode } from "react";


interface AuthGuardProps {
  fallback?: ReactNode;
  spinner?: ReactNode;
  geoBlocked?: boolean;
}

export function AuthGuard({
  children,
  fallback,
  geoBlocked,
}: PropsWithChildren<AuthGuardProps>) {

  if ( geoBlocked) {
    return  fallback;
  }

  return children;
}
