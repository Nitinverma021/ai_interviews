import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";

import { getCurrentUser, hasSessionCookie } from "@/lib/actions/auth.action";
import { getSiteVisibleFlag } from "@/lib/env.server";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";
import SiteRestricted from "@/components/SiteRestricted";

const Layout = async ({ children }: { children: ReactNode }) => {
  const hasSession = await hasSessionCookie();
  if (!hasSession) redirect("/sign-in");
  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";
  const isSiteVisible = getSiteVisibleFlag();

  if (!isSiteVisible && !isAdmin) {
    return <SiteRestricted />;
  }

  return (
    <div className="root-layout">
      <nav className="app-nav">
        <Link href="/" className="brand-lockup">
          <Image src="/logo.svg" alt="PrepWise Logo" width={38} height={32} />
          <span>PrepWise</span>
        </Link>

        <div className="nav-actions">
          <Link href="/" className="nav-link">
            Dashboard
          </Link>
          {isAdmin && (
            <>
              <Link href="/admin" className="nav-link">
                Admin
              </Link>
              <Link href="/analytics" className="nav-link">
                Analytics
              </Link>
            </>
          )}
          <Button asChild className="btn-primary">
            <Link href="/interview" data-umami-event="start_interview_nav">
              Start
            </Link>
          </Button>
          <Button asChild className="btn-secondary">
            <Link href="/profile">
              <UserRound />
              Profile
            </Link>
          </Button>
          <LogoutButton />
        </div>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
