"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/types";

const tasks = [
  { match: "/results", href: "/results", bn: "ফলাফল", en: "Results" },
  { match: "/admission", href: "/admission/apply", bn: "ভর্তি", en: "Apply" },
  { match: "/notices", href: "/notices", bn: "নোটিশ", en: "Notices" },
] as const;

function isCurrent(href: string, path: string) {
  return path === href || path.startsWith(`${href}/`);
}

export function MobileTasks({ lang }: { lang: Lang }) {
  const path = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-card lg:hidden"
      aria-label={lang === "bn" ? "দ্রুত কাজ" : "Quick tasks"}
    >
      {tasks.map((task) => {
        const current = isCurrent(task.match, path);
        return (
          <Link
            key={task.match}
            href={task.href}
            aria-current={current ? "page" : undefined}
            className={
              current
                ? "grid h-14 place-items-center bg-brand text-sm font-semibold text-on-brand"
                : "grid h-14 place-items-center text-sm font-semibold"
            }
          >
            {lang === "bn" ? task.bn : task.en}
          </Link>
        );
      })}
    </nav>
  );
}
