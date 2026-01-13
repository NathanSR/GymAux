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