import { atom } from 'recoil';

export type PendingInput = {
  label: string;
  resolve: (value: string) => void;
};

// Set while the interpreter is suspended on an "입력받는다" statement, waiting
// for the terminal to collect a value from the user and resolve it.
const pendingInputState = atom<PendingInput | null>({
  key: 'pendingInputState',
  default: null,
});

const isRunningState = atom<boolean>({
  key: 'isRunningState',
  default: false,
});

export { pendingInputState, isRunningState };
