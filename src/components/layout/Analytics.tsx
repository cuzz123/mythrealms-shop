"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  CONSENT_STORAGE_KEY,
  createConsentSubscriptionController,
  type ConsentEventTarget,
  type ConsentState,
} from "@/lib/analytics/consent";

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pinterestId = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;
  const [consent, setConsent] = useState<ConsentState>({ analytics: false, marketing: false });

  useEffect(() => {
    const target: ConsentEventTarget = {
      addEventListener: (type, listener) => window.addEventListener(type, listener as EventListener),
      removeEventListener: (type, listener) => window.removeEventListener(type, listener as EventListener),
    };

    const controller = createConsentSubscriptionController({
      target,
      readConsent: () => localStorage.getItem(CONSENT_STORAGE_KEY),
      onConsentChange: setConsent,
      reload: () => window.location.reload(),
    });
    controller.start();
    return controller.cleanup;
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
