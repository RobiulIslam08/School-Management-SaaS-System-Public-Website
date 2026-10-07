"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Lang, MenuItem } from "@/lib/types";
import { pick } from "@/lib/text";

const DASHBOARD = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://localhost:3000";

function itemHref(item: { key: string; href: string }): string {
  if (item.key === "login") return `${DASHBOARD}/login`;
  return item.href;
}

function isCurrent(href: string, path: string): boolean {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

function indexLabel(n: number, lang: Lang): string {
  const raw = String(n).padStart(2, "0");
  if (lang !== "bn") return raw;
  return raw.replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)] ?? digit);
}

function Caret({ open }: { open: boolean }) {
  return (
    <svg className={open ? "nav-caret is-open" : "nav-caret"} viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
      <path d="M2.2 4.2 6 8l3.8-3.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SiteNav({
  menus,
  lang,
  schoolName,
  mark,
}: {
  menus: MenuItem[];
  lang: Lang;
  schoolName: string;
  mark: string;
}) {
  const path = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [drawerKey, setDrawerKey] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);
  const titleId = useId();
  const visible = menus.filter((item) => item.visible !== false && item.key !== "login");
  const bn = lang === "bn";

  function arm(key: string) {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenKey(key);
  }

  function disarm(node: HTMLElement) {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      if (node.contains(document.activeElement)) return;
      setOpenKey(null);
    }, 140);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenKey(null);
    }
    function onPointer(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) setOpenKey(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!drawer) return;
    const node = panel.current;
    const previous = document.activeElement as HTMLElement | null;
    node?.querySelector<HTMLElement>("a,button")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrawer(false);
        button.current?.focus();
      }
      if (event.key !== "Tab" || !node) return;
      const items = [...node.querySelectorAll<HTMLElement>("a,button")];
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [drawer]);

  return (
    <>
      <nav ref={navRef} className="desk-nav" aria-label={bn ? "প্রধান মেনু" : "Main"}>
        {visible.map((item, index) => {
          const children = (item.children ?? []).filter((child) => child.visible !== false);
          const label = pick(lang, item.labelBn, item.labelEn);
          const current = isCurrent(item.href, path) || children.some((child) => isCurrent(child.href, path));
          if (!children.length) {
            return (
              <Link key={item.key} className={current ? "nav-link is-current" : "nav-link"} href={itemHref(item)}>
                {label}
              </Link>
            );
          }
          const open = openKey === item.key;
          return (
            <div
              key={item.key}
              className={open ? "nav-item is-open" : current ? "nav-item is-current" : "nav-item"}
              data-align={index >= 3 ? "end" : "start"}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") arm(item.key);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") disarm(event.currentTarget);
              }}
              onFocus={() => arm(item.key)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) disarm(event.currentTarget);
              }}
            >
              <Link href={item.href}>{label}</Link>
              <button
                type="button"
                className="nav-toggle"
                aria-expanded={open}
                aria-label={bn ? `${label} সাবমেনু` : `${label} submenu`}
                onClick={() => setOpenKey(open ? null : item.key)}
              >
                <Caret open={open} />
              </button>
              {open ? (
                <div className="menu-fly" role="region" aria-label={label}>
                  <div className="menu-rail">
                    <p className="section-kicker">{bn ? "অধ্যায়" : "Section"}</p>
                    <p className="display menu-rail-title">{label}</p>
                    <Link className="menu-all" href={item.href}>
                      {bn ? "সব দেখুন" : "View all"}
                    </Link>
                  </div>
                  <div className={children.length > 4 ? "menu-links menu-links-split" : "menu-links"}>
                    {children.map((child, childIndex) => (
                      <Link key={child.key} href={child.href}>
                        <span className="menu-index">{indexLabel(childIndex + 1, lang)}</span>
                        <span>{pick(lang, child.labelBn, child.labelEn)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
      <button
        ref={button}
        type="button"
        className="menu-launch"
        aria-expanded={drawer}
        aria-controls={titleId}
        onClick={() => setDrawer(true)}
      >
        {bn ? "মেনু" : "Menu"}
      </button>
      {drawer && typeof document !== "undefined"
        ? createPortal(
            <div className="drawer-backdrop" onClick={() => setDrawer(false)}>
              <div
                ref={panel}
                id={titleId}
                role="dialog"
                aria-modal="true"
                aria-label={bn ? "মেনু" : "Menu"}
                className="drawer-panel"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="drawer-brand">
                  <span className="brand-seal" aria-hidden="true">
                    <span>{mark}</span>
                  </span>
                  <p className="display drawer-name">{schoolName}</p>
                  <button type="button" className="drawer-close" onClick={() => setDrawer(false)}>
                    {bn ? "বন্ধ" : "Close"}
                  </button>
                </div>
                {visible.map((item) => {
                  const children = (item.children ?? []).filter((child) => child.visible !== false);
                  const label = pick(lang, item.labelBn, item.labelEn);
                  const expanded = drawerKey === item.key;
                  return (
                    <div key={item.key} className="drawer-group">
                      <div className="drawer-row">
                        <Link href={itemHref(item)} onClick={() => setDrawer(false)}>
                          {label}
                        </Link>
                        {children.length ? (
                          <button
                            type="button"
                            aria-expanded={expanded}
                            aria-label={bn ? `${label} সাবমেনু` : `${label} submenu`}
                            onClick={() => setDrawerKey(expanded ? null : item.key)}
                          >
                            <Caret open={expanded} />
                          </button>
                        ) : null}
                      </div>
                      {expanded
                        ? children.map((child, childIndex) => (
                            <Link key={child.key} className="drawer-child" href={child.href} onClick={() => setDrawer(false)}>
                              <span className="menu-index">{indexLabel(childIndex + 1, lang)}</span>
                              {pick(lang, child.labelBn, child.labelEn)}
                            </Link>
                          ))
                        : null}
                    </div>
                  );
                })}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
