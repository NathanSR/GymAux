import PageTransition from "@/components/ui/PageTransition";
import { ReactNode } from "react";

/**
 * Next.js Template
 * 
 * Templates are similar to layouts but create a new instance for each sibling page
 * when navigating. This is where we inject the PageTransition to ensure animations
 * trigger on every route change.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <PageTransition>
      {children}
    </PageTransition>
  );
}
