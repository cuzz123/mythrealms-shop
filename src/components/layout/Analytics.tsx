"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
  CONSENT_STORAGE_KEY,
  createConsentSubscriptionController,
  type ConsentEventTarget,
  type ConsentState,
} from "@/lib/analytics/consent";
import {
  reportAiReferralOnce,
  shouldReportAiReferral,
} from "@/lib/analytics/referral";
import { flushTrackingQueue } from "@/lib/tracking";

const TRACKING_READY_EVENTS = {
  ga: "mythrealms:ga-ready",
  meta: "mythrealms:meta-ready",
  pinterest: "mythrealms:pinterest-ready",
} as const;

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pinterestId = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;
  const [consent, setConsent] = useState<ConsentState>({
    analytics: false,
    marketing: false,
  });
  const [gaInitialized, setGaInitialized] = useState(false);
  const referralDedupe = useRef(false);

  useEffect(() => {
    const target: ConsentEventTarget = {
      addEventListener: (type, listener) =>
        window.addEventListener(type, listener as unknown as EventListener),
      removeEventListener: (type, listener) =>
        window.removeEventListener(type, listener as unknown as EventListener),
    };

    const controller = createConsentSubscriptionController({
      target,
      readConsent: () => localStorage.getItem(CONSENT_STORAGE_KEY),
      onConsentChange: (nextConsent) => {
        setConsent(nextConsent);
        if (!nextConsent.analytics) setGaInitialized(false);
      },
      reload: () => window.location.reload(),
    });
    const flushGa = () => {
      flushTrackingQueue("ga");
      setGaInitialized(true);
    };
    const flushMeta = () => flushTrackingQueue("meta");
    const flushPinterest = () => flushTrackingQueue("pinterest");

    window.addEventListener(TRACKING_READY_EVENTS.ga, flushGa);
    window.addEventListener(TRACKING_READY_EVENTS.meta, flushMeta);
    window.addEventListener(TRACKING_READY_EVENTS.pinterest, flushPinterest);
    controller.start();
    return () => {
      controller.cleanup();
      window.removeEventListener(TRACKING_READY_EVENTS.ga, flushGa);
      window.removeEventListener(TRACKING_READY_EVENTS.meta, flushMeta);
      window.removeEventListener(TRACKING_READY_EVENTS.pinterest, flushPinterest);
    };
  }, []);

  useEffect(() => {
    if (!shouldReportAiReferral(consent.analytics, gaInitialized)) return;

    try {
      const gtag = (window as AnalyticsWindow).gtag;
      if (!gtag) return;
      reportAiReferralOnce({
        locationHref: window.location.href,
        sessionStorage: window.sessionStorage,
        gtag,
        dedupe: referralDedupe,
      });
    } catch {
      // Browser APIs can be unavailable in privacy-restricted contexts.
    }
  }, [consent.analytics, gaInitialized]);

  if (!gaId && !pixelId && !pinterestId) return null;

  return (
    <>
      {gaId && consent.analytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga-init"
            strategy="afterInteractive"
            onReady={() => flushTrackingQueue("ga")}
          >
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');window.dispatchEvent(new Event('mythrealms:ga-ready'))`}
          </Script>
        </>
      )}
      {pixelId && consent.marketing && (
        <>
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            onReady={() => flushTrackingQueue("meta")}
          >
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');window.dispatchEvent(new Event('mythrealms:meta-ready'))`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element -- Tracking pixels require literal noscript images. */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
      {pinterestId && consent.marketing && (
        <>
          <Script
            id="pinterest-tag"
            strategy="afterInteractive"
            onReady={() => flushTrackingQueue("pinterest")}
          >
            {`!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");pintrk('load','${pinterestId}');pintrk('page');window.dispatchEvent(new Event('mythrealms:pinterest-ready'))`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element -- Tracking pixels require literal noscript images. */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://ct.pinterest.com/v3/?event=init&tid=${pinterestId}&noscript=1`}
            />
          </noscript>
        </>
      )}
    </>
  );
}
