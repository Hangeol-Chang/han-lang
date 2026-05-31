"use client";

import CodeBlock from "../CodeBlock";

export default function Comments() {
    return (
        <article>
            <h1>주석</h1>
            <p>주석은 실행되지 않는 설명 메모입니다. <code>//</code>로 시작하는 줄 이후는 모두 무시됩니다.</p>

            <h2>한 줄 주석</h2>
            <CodeBlock>{`// 이 줄은 실행되지 않습니다
사과는 3 이다.  // 사과 변수에 3 저장
(사과)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`3`}</CodeBlock>

            <h2>활용 팁</h2>
            <p>코드가 무엇을 하는지 설명하거나, 일시적으로 실행을 막을 때 씁니다.</p>
            <CodeBlock>{`// 1단계: 변수 초기화
합계는 0 이다.
i는 1 이다.

// 2단계: 1부터 5까지 더하기
(i <= 5) 동안
\t합계는 합계 + i 이다.
\ti는 i + 1 이다.

// 3단계: 결과 출력
(합계)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`15`}</CodeBlock>

            <blockquote>
                현재 한랭은 <code>//</code> 한 줄 주석만 지원합니다.<br/>
                <code>/* … */</code> 여러 줄 주석은 지원하지 않습니다.
            </blockquote>
        </article>
    );
}
