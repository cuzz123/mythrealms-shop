"use client";

import Script from "next/script";
import { useState, useEffect } from "react";

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pinterestId = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;

  // Only load analytics if the user has consented
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cookie-consent");
      if (raw) {
        const consent = JSON.parse(raw);
        // "all" means both analytics and marketing are accepted,
        // "analytics" means at minimum analytics is accepted
        if (consent.analytics === true || consent.all === true) {
          setConsented(true);
        }
      }
    } catch {
      // Corrupt consent value — treat as no consent
    }
  }, []);

  if (!gaId && !pixelId && !pinterestId) return null;
  if (!consented) return null;

  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}')`}
          </Script>
        </>
      )}
      {pixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView')`}
          </Script>
          <noscript>
            <img height="1" width="1" style={{ display: "none" }} src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} alt="" />
          </noscript>
        </>
      )}
      {pinterestId && (
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
