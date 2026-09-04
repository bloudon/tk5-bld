declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "teamk5_analytics_consent";
const gtmId = import.meta.env.VITE_GTM_ID?.trim();
const ga4Id = import.meta.env.VITE_GA4_ID?.trim() || "G-27WK2KCNDX";

export type Attribution = {
  landingPage: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

function layer() {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

export function analyticsConsent() {
  return localStorage.getItem(CONSENT_KEY);
}

export function setAnalyticsConsent(granted: boolean) {
  localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  layer().push({ event: "consent_update", analytics_storage: granted ? "granted" : "denied" });
  if (granted) loadAnalytics();
}

export function trackCurrentPage() {
  track("page_view", {
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
    page_title: document.title,
  });
}

export function loadAnalytics() {
  if (analyticsConsent() !== "granted" || document.querySelector("[data-teamk5-analytics]")) return;
  if (gtmId) {
    layer().push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.dataset.teamk5Analytics = "gtm";
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.appendChild(script);
  } else if (ga4Id) {
    const script = document.createElement("script");
    script.async = true;
    script.dataset.teamk5Analytics = "ga4";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
    document.head.appendChild(script);
    window.gtag = (...args: unknown[]) => layer().push(args);
    window.gtag("js", new Date());
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("config", ga4Id, { send_page_view: false });
  }
}

export function track(event: string, values: Record<string, unknown> = {}) {
  if (analyticsConsent() !== "granted") return;
  if (ga4Id && !gtmId && window.gtag) window.gtag("event", event, values);
  else layer().push({ event, ...values });
}

export function getAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const current: Attribution = {
    landingPage: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || undefined,
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    utmContent: params.get("utm_content") || undefined,
  };
  const stored = sessionStorage.getItem("teamk5_attribution");
  if (stored) {
    try {
      return JSON.parse(stored) as Attribution;
    } catch {
      sessionStorage.removeItem("teamk5_attribution");
    }
  }
  sessionStorage.setItem("teamk5_attribution", JSON.stringify(current));
  return current;
}