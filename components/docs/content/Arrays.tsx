"use client";

import CodeBlock from "../CodeBlock";

export default function Arrays() {
    return (
        <article>
            <h1>배열</h1>
            <p>여러 값을 순서대로 모아서 하나의 변수로 다룰 때 사용합니다.</p>

            <h2>배열 만들기</h2>
            <p>대괄호(<code>[ ]</code>) 안에 값을 쉼표로 구분해 나열합니다.</p>
            <CodeBlock>{`숫자들은 [1, 2, 3] 이다.
이름들은 ["철수", "영희"] 이다.
빈배열은 [] 이다.`}</CodeBlock>

            <h2>배열 출력</h2>
            <p>배열을 그대로 출력하면 <code>[값, 값, ...]</code> 형태로 표시됩니다.</p>
            <CodeBlock>{`숫자들은 [1, 2, 3] 이다.
(숫자들)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`[1, 2, 3]`}</CodeBlock>

            <h2>인덱스로 값 읽기</h2>
            <p>
                인덱스는 <strong>0부터</strong> 시작합니다. <code>이름[인덱스]</code> 형태로 접근합니다.
            </p>
            <CodeBlock>{`숫자들은 [10, 20, 30] 이다.
(숫자들[0])를 출력한다.
(숫자들[2])를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`10
30`}</CodeBlock>

            <h2>인덱스로 값 바꾸기</h2>
            <CodeBlock>{`숫자들은 [1, 2, 3] 이다.
숫자들[0]은 99 이다.
(숫자들)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`[99, 2, 3]`}</CodeBlock>

            <h2>값 추가하기</h2>
            <p>
                인덱스가 배열 길이와 <strong>정확히 같으면</strong> 새 값이 끝에 추가됩니다.
                그보다 더 큰 인덱스는 오류가 됩니다.
            </p>
            <CodeBlock>{`숫자들은 [1, 2] 이다.
숫자들[2]는 3 이다.   // 길이(2)와 같은 인덱스 → 추가됨
(숫자들)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`[1, 2, 3]`}</CodeBlock>

            <h2>길이 구하기 — <code>길이()</code></h2>
            <p>배열이나 문자열의 길이를 구하는 내장 함수입니다.</p>
            <CodeBlock>{`숫자들은 [1, 2, 3, 4] 이다.
(길이(숫자들))를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`4`}</CodeBlock>

            <h2>배열과 반복문 함께 쓰기</h2>
            <CodeBlock>{`숫자들은 [1, 2, 3, 4, 5] 이다.
합계는 0 이다.
i는 0 이다.
(i < 길이(숫자들)) 동안
\t합계는 합계 + 숫자들[i] 이다.
\ti는 i + 1 이다.
(합계)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`15`}</CodeBlock>

            <h2>주의사항</h2>
            <ul>
                <li>인덱스는 0 이상, 배열 길이 이하만 허용됩니다. 범위를 벗어나면 오류가 발생합니다.</li>
                <li>음수 인덱스는 지원하지 않습니다.</li>
                <li>배열 안에 배열을 넣어 다차원처럼 사용할 수도 있습니다 (<code>[[1,2],[3,4]]</code>).</li>
            </ul>
            <CodeBlock>{`숫자들은 [1, 2] 이다.
(숫자들[5])를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`[오류] 배열 범위를 벗어났습니다 (길이: 2, 인덱스: 5)`}</CodeBlock>
        </article>
    );
}
