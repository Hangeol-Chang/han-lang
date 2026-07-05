"use client";

import CodeBlock from "../CodeBlock";

export default function Operators() {
    return (
        <article>
            <h1>연산자</h1>
            <p>한랭은 수식 기호를 그대로 사용합니다. 한국어 표현(<code>더하기</code>, <code>빼기</code> 등)은 사용하지 않습니다.</p>

            <h2>산술 연산자</h2>
            <table>
                <thead>
                    <tr><th>연산자</th><th>의미</th><th>예시</th><th>결과</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>+</code></td><td>더하기</td><td><code>3 + 2</code></td><td><code>5</code></td></tr>
                    <tr><td><code>-</code></td><td>빼기</td><td><code>3 - 2</code></td><td><code>1</code></td></tr>
                    <tr><td><code>*</code></td><td>곱하기</td><td><code>3 * 2</code></td><td><code>6</code></td></tr>
                    <tr><td><code>/</code></td><td>나누기</td><td><code>7 / 2</code></td><td><code>3.5</code></td></tr>
                </tbody>
            </table>
            <CodeBlock>{`결과는 2 + 3 * 4 이다.
(결과)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`14`}</CodeBlock>
            <blockquote>곱셈·나눗셈이 덧셈·뺄셈보다 먼저 계산됩니다 (일반 수학 규칙과 동일).</blockquote>

            <h2>비교 연산자</h2>
            <p>비교 결과는 <code>진실</code> 또는 <code>거짓</code>입니다.</p>
            <table>
                <thead>
                    <tr><th>연산자</th><th>의미</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>==</code></td><td>같다</td></tr>
                    <tr><td><code>!=</code></td><td>다르다</td></tr>
                    <tr><td><code>&lt;</code></td><td>작다</td></tr>
                    <tr><td><code>&gt;</code></td><td>크다</td></tr>
                    <tr><td><code>&lt;=</code></td><td>작거나 같다</td></tr>
                    <tr><td><code>&gt;=</code></td><td>크거나 같다</td></tr>
                </tbody>
            </table>

            <h2>한국어 비교 표현</h2>
            <p>기호 대신 한국어 서술어로도 비교식을 쓸 수 있습니다. <code>A가 B보다 ~하다</code> 형태입니다.</p>
            <table>
                <thead>
                    <tr><th>표현</th><th>기호</th><th>예시</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>크다</code></td><td><code>&gt;</code></td><td><code>사과가 배보다 크다</code></td></tr>
                    <tr><td><code>작다</code></td><td><code>&lt;</code></td><td><code>사과가 배보다 작다</code></td></tr>
                    <tr><td><code>크거나 같다</code></td><td><code>&gt;=</code></td><td><code>사과가 배보다 크거나 같다</code></td></tr>
                    <tr><td><code>작거나 같다</code></td><td><code>&lt;=</code></td><td><code>사과가 배보다 작거나 같다</code></td></tr>
                    <tr><td><code>같다</code></td><td><code>==</code></td><td><code>사과가 배 와 같다</code></td></tr>
                    <tr><td><code>다르다</code></td><td><code>!=</code></td><td><code>사과가 배 랑 다르다</code></td></tr>
                </tbody>
            </table>
            <ul>
                <li><code>보다</code>는 앞 단어에 붙여 써도 됩니다 (<code>배보다</code>).</li>
                <li><code>와</code>/<code>과</code>/<code>랑</code>은 반드시 띄어 씁니다 (<code>배 와</code>, <code>배 랑</code>) — 붙여 쓰면 &quot;사과&quot;, &quot;사랑&quot;처럼 원래 단어와 구분이 안 되기 때문입니다.</li>
                <li>조건 뒤 트리거(<code>면</code> 등)도 서술어에 그대로 붙여 쓸 수 있습니다: <code>배보다 작거나 같다면</code>.</li>
            </ul>
            <CodeBlock>{`사과는 3 이다.
배는 5 이다.
만약 (사과가 배보다 작다) 면
\t("사과가 더 작아요")를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`사과가 더 작아요`}</CodeBlock>

            <h2>문자열 이어 붙이기</h2>
            <p><code>+</code>는 문자열에도 사용할 수 있습니다. 숫자와 문자열을 <code>+</code>로 연결하면 자동으로 문자열로 변환됩니다.</p>
            <CodeBlock>{`이름은 "철수" 이다.
나이는 17 이다.
소개는 이름 + "의 나이는 " + 나이 + "살" 이다.
(소개)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`철수의 나이는 17살`}</CodeBlock>

            <h2>연산 순서</h2>
            <p>괄호를 사용해 계산 순서를 명시할 수 있습니다.</p>
            <CodeBlock>{`a는 (2 + 3) * 4 이다.
b는 2 + 3 * 4 이다.
(a)를 출력한다.
(b)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`20
14`}</CodeBlock>
        </article>
    );
}
