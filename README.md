<center>

![Flip Dot Display](https://flipdots.vercel.app/api/svg?customdots=8%2C4%2CFF%2C0%2C7E%2C87%2C99%2CE1%2C7E&style=dark&dotSize=20&spacing=2&animationMode=staticD)

# 한랭 (han-lang)

한국어 문법으로 코딩하는 프로그래밍 언어

[![웹 IDE](https://img.shields.io/badge/웹_IDE-바로_써보기-4caf50)](https://hangeol-chang.github.io/han-lang)
[![VS Code 확장](https://img.shields.io/visual-studio-marketplace/v/hangeol-chang.hanlang?label=VS%20Code%20확장&color=007acc)](https://marketplace.visualstudio.com/items?itemName=hangeol-chang.hanlang)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

</center>

## 소개

영어 문법(주어-동사-목적어) 대신 **한국어 문법**으로 코드를 쓰는 프로그래밍 언어입니다.
한국어로 변수, 조건문, 반복문, 함수, 배열까지 다루는 기초 프로그래밍 개념을 먼저 익히고,
이후 다른 언어로 자연스럽게 넘어가는 것을 목표로 합니다.

```
사과는 3 이다.
인삿말은 "안녕하세요!" 이다.
(인삿말)를 출력한다.

만약 (사과 < 10) 라면
	("사과가 10보다 작아요")를 출력한다.
아니면
	("사과가 10 이상이에요")를 출력한다.

함수 더하기(a, b)
	(a + b)를 반환한다.

(더하기(3, 4))를 출력한다.
```

## 둘러보기

| | |
|---|---|
| 🖥️ **웹 IDE** | [hangeol-chang.github.io/han-lang](https://hangeol-chang.github.io/han-lang) — 브라우저에서 바로 코드를 작성하고 실행 |
| 📖 **문서** | [/docs](https://hangeol-chang.github.io/han-lang/docs) — 변수, 조건문, 반복문, 배열, 함수 등 전체 문법 |
| 🧩 **VS Code 확장** | [Marketplace](https://marketplace.visualstudio.com/items?itemName=hangeol-chang.hanlang) — `.hl` 파일 문법 하이라이팅 |

## 지원 문법

- 변수 선언/초기화 (`이다`, `있다`) — 조사(은/는/이/가 등) 자동 인식
- 조건문 (`만약 … 라면 / 이면 / 이라면 / 면`, `아니면`)
- 반복문 (`… 동안`)
- 함수 (`함수`, `반환한다`) — 재귀 호출, 호이스팅 지원
- 배열 (`[ ]`, 인덱싱, `길이()` 내장 함수)
- 출력 (`출력한다`, printf 스타일 포맷팅)
- 한 줄 주석 (`//`)

자세한 문법은 [문서 페이지](https://hangeol-chang.github.io/han-lang/docs)를 참고하세요.

## 개발

```bash
npm install
npm run dev       # localhost:3000
npm run build     # 프로덕션 빌드
npm run lint
npm run deploy    # GitHub Pages 배포
```

언어 엔진은 `components/core/`에 있습니다 (렉서 → 파서 → 인터프리터로 이어지는 파이프라인).
자세한 구조는 [CLAUDE.md](CLAUDE.md)를 참고하세요.

## 프로젝트 구조

```
components/
├── core/           # 언어 엔진 (lexer, parser, interpreter)
├── main/           # 에디터, 터미널 UI
└── docs/           # 문서 페이지
editors/vscode/     # VS Code 확장 (문법 하이라이팅)
samples/han-lang/   # 예제 .hl 코드
log/                # 설계 노트, 문법 정리
```

## 참고 자료

기존 한글 프로그래밍 언어들을 조사하며 참고한 자료입니다 ([log/01_analyze.md](log/01_analyze.md)).

- [나무위키 - 한글 프로그래밍 언어](https://namu.wiki/w/%ED%95%9C%EA%B8%80%20%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%20%EC%96%B8%EC%96%B4)
- [말씨](https://github.com/recu3125/malC_lang)
- [도깨비 (DoKev)](https://github.com/BackGwa/DoKev)

## 라이선스

[MIT](LICENSE)
