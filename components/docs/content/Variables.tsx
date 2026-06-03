"use client";

import CodeBlock from "../CodeBlock";

export default function Variables() {
    return (
        <article>
            <h1>변수</h1>
            <p>
                변수는 값을 담는 이름표입니다. 한랭에서는 한국어 이름을 그대로 사용할 수 있습니다.
            </p>

            <h2>선언 — <code>있다</code></h2>
            <p>값 없이 변수만 먼저 만들어 놓을 때 사용합니다.</p>
            <CodeBlock>{`자두가 있다.
결과가 있다.`}</CodeBlock>
            <blockquote>변수 이름 뒤에 조사(<code>가</code>, <code>는</code>, <code>이</code>, <code>은</code> 등)를 자연스럽게 붙여 쓸 수 있습니다.</blockquote>

            <h2>선언 & 초기화 — <code>이다</code></h2>
            <p>변수를 만들면서 동시에 값을 넣습니다.</p>
            <CodeBlock>{`사과는 3 이다.
인삿말은 "안녕하세요!" 이다.
정답은 진실 이다.`}</CodeBlock>

            <h2>재할당</h2>
            <p>이미 선언된 변수에 새 값을 넣을 때도 <code>이다</code>를 사용합니다.</p>
            <CodeBlock>{`카운터는 0 이다.
카운터는 카운터 + 1 이다.
(카운터)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`1`}</CodeBlock>

            <h2>변수 이름 규칙</h2>
            <ul>
                <li>한국어(한글), 영문자, 숫자, 밑줄(<code>_</code>) 조합 가능</li>
                <li>숫자로 시작 불가</li>
                <li>
                    <strong>조사로 끝나는 이름 주의</strong> — <code>는/은/를/을/이/가</code> 등으로
                    끝나는 이름은 조사가 자동으로 제거됩니다.
                    예: 변수 이름을 <code>결과</code>로 쓰고 싶다면 선언 시 <code>결과는 … 이다.</code>로 작성하세요.
                </li>
            </ul>

            <h2>예제</h2>
            <CodeBlock>{`너비는 5 이다.
높이는 3 이다.
넓이는 너비 * 높이 이다.
(넓이)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`15`}</CodeBlock>
        </article>
    );
}
