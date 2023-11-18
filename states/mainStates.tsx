import { atom } from 'recoil';

const animationInitFlagState = atom<boolean>({
    key : 'animationInitFlagState',
    default : false
})

const canChangePageState = atom<boolean>({
    key : 'canChangePageState',
    default : true,
})

export {
    animationInitFlagState,
    canChangePageState
};