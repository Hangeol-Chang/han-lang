"use client";

import CodeBlock from "../CodeBlock";

export default function IfElse() {
    return (
        <article>
            <h1>조건문</h1>
            <p>조건에 따라 다른 코드를 실행할 때 사용합니다.</p>

            <h2>기본 문법</h2>
            <CodeBlock>{`만약 (조건) 라면
\t// 조건이 참일 때 실행
아니면
\t// 조건이 거짓일 때 실행`}</CodeBlock>
            <ul>
                <li>조건은 반드시 <code>( )</code>로 감쌉니다.</li>
                <li>실행할 코드는 <strong>탭(Tab)</strong>으로 들여씁니다.</li>
                <li><code>아니면</code> (else) 절은 생략할 수 있습니다.</li>
            </ul>

            <h2>if 트리거 키워드</h2>
            <p>조건 뒤에 오는 키워드는 아래 중 아무것이나 사용할 수 있습니다.</p>
            <table>
                <thead>
                    <tr><th>키워드</th><th>예시</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>라면</code></td><td><code>만약 (조건) 라면</code></td></tr>
                    <tr><td><code>이면</code></td><td><code>만약 (조건) 이면</code></td></tr>
                    <tr><td><code>이라면</code></td><td><code>만약 (조건) 이라면</code></td></tr>
                    <tr><td><code>면</code></td><td><code>만약 (조건) 면</code></td></tr>
                </tbody>
            </table>

            <h2>예제 — else 없는 if</h2>
            <CodeBlock>{`점수는 85 이다.
만약 (점수 >= 60) 라면
\t("합격입니다!")를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`합격입니다!`}</CodeBlock>

            <h2>예제 — if / else</h2>
            <CodeBlock>{`온도는 -3 이다.
만약 (온도 < 0) 이면
\t("영하입니다")를 출력한다.
아니면
\t("영상입니다")를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`영하입니다`}</CodeBlock>

            <h2>예제 — 중첩 조건문</h2>
            <CodeBlock>{`점수는 73 이다.
만약 (점수 >= 90) 라면
\t("A")를 출력한다.
아니면
\t만약 (점수 >= 70) 라면
\t\t("B")를 출력한다.
\t아니면
\t\t("C")를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`B`}</CodeBlock>

            <h2>비교 연산자</h2>
            <p>조건식에 사용할 수 있는 비교 연산자입니다.</p>
            <table>
                <thead>
                    <tr><th>연산자</th><th>의미</th><th>예시</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>==</code></td><td>같다</td><td><code>(사과 == 3)</code></td></tr>
                    <tr><td><code>!=</code></td><td>다르다</td><td><code>(사과 != 0)</code></td></tr>
                    <tr><td><code>&lt;</code></td><td>작다</td><td><code>(사과 &lt; 10)</code></td></tr>
                    <tr><td><code>&gt;</code></td><td>크다</td><td><code>(사과 &gt; 0)</code></td></tr>
                    <tr><td><code>&lt;=</code></td><td>작거나 같다</td><td><code>(사과 &lt;= 5)</code></td></tr>
                    <tr><td><code>&gt;=</code></td><td>크거나 같다</td><td><code>(점수 &gt;= 60)</code></td></tr>
                </tbody>
            </table>

            <h2>예제 — 한국어 비교 표현</h2>
            <p>기호 대신 <code>A가 B보다 ~하다</code> 형태의 한국어 서술어로도 조건을 쓸 수 있습니다. 자세한 표현 목록은 사이드바의 <strong>연산자</strong> 문서를 참고하세요.</p>
            <CodeBlock>{`사과는 3 이다.
배는 5 이다.
만약 (사과가 배보다 작거나 같다) 면
\t("사과를 사러 가야 해")를 출력한다.
아니면
\t("안 사도 돼")를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`사과를 사러 가야 해`}</CodeBlock>
        </article>
    );
}
