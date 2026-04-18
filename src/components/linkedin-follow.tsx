import { Linkedin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkedInFollowProps {
  className?: string;
  /** Copy variant — "post_optin" assumes user just submitted a form. */
  variant?: "post_optin" | "generic";
}

const LINKEDIN_URL = "https://www.linkedin.com/in/sebastianvogg/";

export function LinkedInFollow({
  className,
  variant = "post_optin",
}: LinkedInFollowProps) {
  const title =
    variant === "post_optin"
      ? "Noch einen Schritt: Folge Sebastian auf LinkedIn"
      : "Folge Sebastian auf LinkedIn";
  const subtitle =
    variant === "post_optin"
      ? "Mehr TikTok-Learnings direkt aus dem Tagesgeschäft — wöchentlich."
      : "TikTok-Learnings direkt aus dem Tagesgeschäft.";

  return (
    <a
      href={LINKEDIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-all hover:border-[#0A66C2]/60 hover:shadow-glow",
        className
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0A66C2] text-white">
        <Linkedin className="h-5 w-5" fill="currentColor" strokeWidth={0} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-muted truncate">{subtitle}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
    </a>
  );
}
