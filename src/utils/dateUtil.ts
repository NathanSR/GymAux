// 1. Lógica do TimeAgo Nativo (Substituindo Moment)
export const getRelativeTime = (date: Date, lang: string) => {
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
    const secondsAgo = Math.floor((date.getTime() - new Date().getTime()) / 1000);

    if (Math.abs(secondsAgo) < 60) return rtf.format(secondsAgo, 'second');
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (Math.abs(minutesAgo) < 60) return rtf.format(minutesAgo, 'minute');
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (Math.abs(hoursAgo) < 24) return rtf.format(hoursAgo, 'hour');
    return rtf.format(Math.floor(hoursAgo / 24), 'day');
};

// 2. Formatação Amigável da Duração (de ms para texto)
export const formatDuration = (ms: number) => {
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    if (hours > 0) {
        return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins} min`;
};


export const formatDate = (date: Date, locale: string) => new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);

/**
 * Returns the current date adjusted to America/Sao_Paulo timezone.
 * This is useful for server-side logic that needs to match the user's day.
 */
export const getBrazilToday = () => {
    const now = new Date();
    return new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
};

/**
 * Returns the day of the week (0-6) for Brazil.
 */
export const getBrazilDayOfWeek = () => {
    return getBrazilToday().getDay();
};

/**
 * Returns the UTC date range corresponding to 'today' in Brazil.
 * Useful for querying databases that store dates in UTC.
 */
export const getBrazilDayRange = () => {
    const today = getBrazilToday();
    const y = today.getFullYear();
    const m = today.getMonth();
    const d = today.getDate();
    
    // America/Sao_Paulo is UTC-3.
    // 00:00 BRT = 03:00 UTC
    // 23:59 BRT = 02:59 UTC (next day)
    const start = new Date(Date.UTC(y, m, d, 3, 0, 0, 0));
    const end = new Date(Date.UTC(y, m, d + 1, 2, 59, 59, 999));
    
    return { start, end };
};