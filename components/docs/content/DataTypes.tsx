"use client";

import CodeBlock from "../CodeBlock";

export default function DataTypes() {
    return (
        <article>
            <h1>자료형</h1>
            <p>한랭이 지원하는 값의 종류입니다.</p>

            <h2>숫자</h2>
            <p>정수와 소수 모두 사용할 수 있습니다. 별도의 타입 선언 없이 그냥 씁니다.</p>
            <CodeBlock>{`정수는 42 이다.
소수는 3.14 이다.
음수는 -7 이다.`}</CodeBlock>
            <p>사칙연산이 가능합니다.</p>
            <CodeBlock>{`합은 10 + 3 이다.      // 13
차는 10 - 3 이다.      // 7
곱은 10 * 3 이다.      // 30
나눗셈은 10 / 3 이다.  // 3.333...`}</CodeBlock>

            <h2>문자열</h2>
            <p>큰따옴표(<code>{'"'}</code>)로 감쌉니다.</p>
            <CodeBlock>{`이름은 "홍길동" 이다.
빈문자는 "" 이다.`}</CodeBlock>

            <h3>이스케이프 문자</h3>
            <table>
                <thead>
                    <tr><th>표기</th><th>의미</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>\n</code></td><td>줄바꿈</td></tr>
                    <tr><td><code>\t</code></td><td>탭</td></tr>
                    <tr><td><code>{'\\"'}</code></td><td>큰따옴표 문자</td></tr>
                    <tr><td><code>{"\\'"}</code></td><td>작은따옴표 문자</td></tr>
                </tbody>
            </table>
            <CodeBlock>{`인삿말은 "안녕!\n반가워요!" 이다.
(인삿말)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`안녕!
반가워요!`}</CodeBlock>

            <h3>문자열 + 숫자 연결</h3>
            <p><code>+</code> 연산자로 문자열과 다른 값을 이어 붙일 수 있습니다.</p>
            <CodeBlock>{`나이는 20 이다.
메시지는 "나이: " + 나이 이다.
(메시지)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`나이: 20`}</CodeBlock>

            <h2>불리언 (참/거짓)</h2>
            <p><code>진실</code>과 <code>거짓</code> 두 가지 값만 있습니다.</p>
            <CodeBlock>{`정답은 진실 이다.
오답은 거짓 이다.

만약 (정답 == 진실) 라면
\t("맞아요!")를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`맞아요!`}</CodeBlock>

            <h2>정의되지 않은 값</h2>
            <p><code>있다</code>로만 선언하고 값을 넣지 않으면 출력 시 <code>정의되지않음</code>으로 표시됩니다.</p>
            <CodeBlock>{`결과가 있다.
(결과)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`정의되지않음`}</CodeBlock>
        </article>
    );
}
