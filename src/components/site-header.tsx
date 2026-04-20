import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-center px-6 py-4 sm:justify-start">
        <Image
          src="/voggs-logo.png"
          alt="VOGGSMEDIA"
          width={140}
          height={32}
          priority
          className="h-6 w-auto sm:h-7"
        />
      </div>
    </header>
  );
}
