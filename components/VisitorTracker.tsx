"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Prevent spamming the owner's WhatsApp by checking session storage
    const hasNotified = sessionStorage.getItem("hbs-visitor-notified");
    if (hasNotified) return;

    // Trigger visitor alert ping
    fetch("/api/notify-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: pathname || "/",
      }),
    })
      .then((res) => {
        if (res.ok) {
          sessionStorage.setItem("hbs-visitor-notified", "true");
        }
      })
      .catch((err) => {
        console.error("Failed to notify visitor activity:", err);
      });

    // 2. Initialize Microsoft Clarity if project ID is provided in Env variables
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
    if (clarityId && typeof window !== "undefined") {
      try {
        const win = window as any;
        if (!win.clarity) {
          win.clarity = win.clarity || function() {
            (win.clarity.q = win.clarity.q || []).push(arguments);
          };
          const scriptEl = document.createElement("script");
          scriptEl.async = true;
          scriptEl.src = `https://www.clarity.ms/tag/${clarityId}`;
          const firstScript = document.getElementsByTagName("script")[0];
          if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(scriptEl, firstScript);
          } else {
            document.head.appendChild(scriptEl);
          }
        }
      } catch (e) {
        console.warn("Clarity initialization failed", e);
      }
    }
  }, [pathname]);

  return null;
}
