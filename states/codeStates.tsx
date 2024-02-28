import { atom } from 'recoil';

const codeState = atom<string>({
    key : 'codeState',
    default : "" 
})

export {
    codeState,
}