// Mirrors horoscope-engine/src/ui.js encodeChart()/decodeChart() exactly, so a
// chart built by our React lead-capture form can be handed to the (untouched)
// horoscope engine via its own `?c=`/`&m=` deep-link format, which auto-computes
// the report on load - see ui.js initLogin().
export const encodeChart = ({ name, dob, tob, lat, lon, tz, gender, place, timeUnknown }) => {
    const payload = {
        n: name,
        d: dob,
        t: tob,
        la: lat,
        lo: lon,
        tz,
        g: gender,
        p: place,
        u: timeUnknown ? 1 : 0
    };
    try {
        return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    } catch (e) {
        return '';
    }
};

// Builds the URL for the embedded horoscope-engine iframe/redirect.
// `partner` is only needed for marriage-match (mode: 'match') products.
export const buildHoroscopeEngineUrl = (subject, partner) => {
    const params = new URLSearchParams();
    params.set('c', encodeChart(subject));
    if (partner) params.set('m', encodeChart(partner));
    return `/horoscope-engine/index.html?${params.toString()}`;
};
