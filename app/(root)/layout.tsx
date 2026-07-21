import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { UserRound } from "lucide-react";

import { hasSessionCookie } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/LogoutButton";

const Layout = async ({ children }: { children: ReactNode }) => {
  const hasSession = await hasSessionCookie();
  if (!hasSession) redirect("/sign-in");

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
