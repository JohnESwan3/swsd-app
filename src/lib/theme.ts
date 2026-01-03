const STORAGE_KEY = 'theme';

export type Theme = 'light' | 'dark';

export const getStored = (): Theme | null =>
    typeof localStorage !== 'undefined'
        ? (localStorage.getItem(STORAGE_KEY) as Theme | null)
        : null;

export const setStored = (t: Theme) =>
    localStorage.setItem(STORAGE_KEY, t);

export const apply = (t: Theme) => {
    const root = document.documentElement;
    t === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
};

export const init = () => {
    const stored = getStored();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'dark' : 'light');
    apply(initial);
};