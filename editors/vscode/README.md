# 한랭 (han-lang) — VS Code 확장

[한랭](https://github.com/Hangeol-Chang/han-lang) 문법 하이라이팅을 제공하는 VS Code 확장입니다.
`.hl` 파일을 열면 키워드, 문자열, 숫자, 함수 등이 색상으로 구분됩니다.

## 로컬에서 사용해보기

마켓플레이스에 올리기 전, 아래 방법으로 로컬에서 바로 테스트할 수 있습니다.

### 방법 1 — 폴더 복사 (가장 간단)

이 폴더(`editors/vscode`)를 VS Code 확장 디렉터리에 복사합니다.

```bash
# Windows
xcopy /E /I editors\vscode "%USERPROFILE%\.vscode\extensions\hanlang"

# macOS / Linux
cp -r editors/vscode ~/.vscode/extensions/hanlang
```

VS Code를 재시작하면 `.hl` 파일에 하이라이팅이 적용됩니다. `example.hl`을 열어 확인하세요.

### 방법 2 — vsce로 패키징

```bash
cd editors/vscode
npx @vscode/vsce package
code --install-extension hanlang-0.1.0.vsix
```

## 구조

```
editors/vscode/
├── package.json                 # 확장 메타데이터, 언어/문법 등록
├── language-configuration.json  # 주석, 괄호, 자동완성, 들여쓰기 규칙
├── syntaxes/
│   └── hanlang.tmLanguage.json  # TextMate 문법 (실제 하이라이팅 규칙)
└── example.hl                   # 동작 확인용 샘플 코드
```

## 마켓플레이스 게시 (추후)

1. [Azure DevOps](https://dev.azure.com)에서 Personal Access Token 발급
2. [marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)에서 publisher 계정(`hangeol-chang`) 생성
3. `LICENSE` 파일 추가 (마켓플레이스 게시 필수 조건)
4. `npx @vscode/vsce publish`

## GitHub Linguist 등록과의 관계

이 확장은 VS Code에서 `.hl` 파일을 보기 좋게 만들어주는 별도 트랙입니다.
GitHub 웹사이트(저장소 파일 보기, 언어 통계)에서 `.hl`을 인식시키려면
[github-linguist/linguist](https://github.com/github-linguist/linguist)에 별도로 등록해야 하며,
이 폴더의 `tm_scope`(`source.hanlang`)가 그 작업의 근거 자료로 쓰입니다.
