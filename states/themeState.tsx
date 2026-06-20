import { atom } from 'recoil';

export type Theme = 'dark' | 'light';

const themeState = atom<Theme>({
    key: 'themeState',
    default: 'dark',
});

export {
    themeState,
};
