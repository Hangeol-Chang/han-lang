import { atom } from 'recoil';

const DEFAULT_CODE = `// 한랭(han-lang) 데모 코드

사과는 3 이다.
인삿말은 "안녕하세요!" 이다.

(인삿말)를 출력한다.
(사과)를 출력한다.

만약 (사과 < 10) 라면
	("사과가 10보다 작아요")를 출력한다.
아니면
	("사과가 10 이상이에요")를 출력한다.

인덱스는 1 이다.
(인덱스 < 4) 동안
	(인덱스)를 출력한다.
	인덱스는 인덱스 + 1 이다.
`;

const codeState = atom<string>({
  key: 'codeState',
  default: DEFAULT_CODE,
});

export { codeState };
