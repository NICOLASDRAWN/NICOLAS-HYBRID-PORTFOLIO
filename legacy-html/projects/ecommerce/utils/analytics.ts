export const GTM_ID = 'AW-16935756539'; // Google Ads ID

export const trackEvent = (action: string, category: string, label: string, value?: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    } else {
        console.log('Event tracked (simulated):', { action, category, label, value });
    }
};

export const trackConversion = (sendTo: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
            'send_to': sendTo
        });
    } else {
        console.log('Conversion tracked (simulated):', sendTo);
    }
}
