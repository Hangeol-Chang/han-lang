import { atom } from 'recoil';

const outputState = atom<string>({
  key: 'outputState',
  default: '',
});

export { outputState };
