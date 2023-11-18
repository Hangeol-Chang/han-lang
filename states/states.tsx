import { atom } from 'recoil';

const prefixState = atom<string>({
    key : 'prefixState',
    default : process.env.NODE_ENV === "production"
        ? `https://hangeol-chang.github.io/han-lang`
        : "", 
})

const relativePrefixState = atom<string>({
    key : 'relativePrefixState',
    default : process.env.NODE_ENV === "production"
        ? `/han-lang`
        : ``,
})

export {
    prefixState,
    relativePrefixState,
};