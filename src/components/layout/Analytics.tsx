"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
  CONSENT_CHANGED_EVENT,
  CONSENT_STORAGE_KEY,
  parseConsent,
  requiresConsentReload,
  type ConsentState,
} from "@/lib/analytics/consent";

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pinterestId = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;
  const [consent, setConsent] = useState<ConsentState>({ analytics: false, marketing: false });
  const previousConsent = useRef<ConsentState>({ analytics: false, marketing: false });

  useEffect(() => {
    const readConsent = () => {
      let nextConsent: ConsentState;
      let persisted = true;

      try {
        nextConsent = parseConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
      } catch {
        nextConsent = parseConsent(null);
        persisted = false;
      }

      const previous = previousConsent.current;
      previousConsent.current = nextConsent;
      setConsent(nextConsent);
      if (persisted && requiresConsentReload(previous, nextConsent)) window.location.reload();
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CONSENT_STORAGE_KEY || event.key === null) readConsent();
    };

    readConsent();
    window.addEventListener(CONSENT_CHANGED_EVENT, readConsent);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, readConsent);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!gaId && !pixelId && !pinterestId) return null;

  return (
    <>
      {gaId && consent.analytics && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}')`}
          </Script>
        </>
      )}
      {pixelId && consent.marketing && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView')`}
          </Script>
          <noscript>
            <img height="1" width="1" style={{ display: "none" }} src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} alt="" />
          </noscript>
        </>
      )}
      {pinterestId && consent.marketing && (
        <>
          <Script id="pinterest-tag" strategy="afterInteractive">
            {`!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");pintrk('load','${pinterestId}');pintrk('page');`}
          </Script>
          <noscript>
            <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://ct.pinterest.com/v3/?event=init&tid=${pinterestId}&noscript=1`} />
          </noscript>
        </>
      )}
    </>
  );
}
