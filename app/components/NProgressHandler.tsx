"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

export default function NProgressHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false, speed: 400, easing: "ease-out" });
  }, []);

  useEffect(() => {
    NProgress.start();
    const t = setTimeout(() => {
      NProgress.done();
    }, 200);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  return null;
}
