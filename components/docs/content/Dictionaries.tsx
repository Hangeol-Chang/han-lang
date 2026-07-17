"use client";

import CodeBlock from "../CodeBlock";

export default function Dictionaries() {
    return (
        <article>
            <h1>사전 (Dictionary)</h1>
            <p>키(key)와 값(value)을 한 쌍으로 묶어 저장하는 자료구조입니다.</p>

            <h2>사전 만들기</h2>
            <p>중괄호(<code>{'{ }'}</code>) 안에 <code>키 : 값</code> 쌍을 쉼표로 구분해 나열합니다.</p>
            <CodeBlock>{`사람은 {"이름" : "철수", "나이" : 20} 이다.
빈사전은 {} 이다.`}</CodeBlock>

            <h2>키로 값 읽기</h2>
            <p><code>사전[키]</code> 형태로 접근합니다.</p>
            <CodeBlock>{`사람은 {"이름" : "철수", "나이" : 20} 이다.
(사람["이름"])를 출력한다.
(사람["나이"])를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`철수
20`}</CodeBlock>

            <h2>키로 값 바꾸기 / 추가하기</h2>
            <p>이미 있는 키면 값을 덮어쓰고, 없는 키면 새로 추가됩니다.</p>
            <CodeBlock>{`사람은 {"이름" : "철수"} 이다.
사람["이름"]는 "영희" 이다.   // 덮어쓰기
사람["나이"]는 20 이다.       // 새로 추가
(사람)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`{이름 : 영희, 나이 : 20}`}</CodeBlock>

            <h2>사전 출력</h2>
            <p>사전을 그대로 출력하면 <code>{'{키 : 값, ...}'}</code> 형태로 표시됩니다.</p>

            <h2>길이 구하기 — <code>길이()</code></h2>
            <p>배열, 문자열과 마찬가지로 <code>길이()</code>로 키-값 쌍의 개수를 구할 수 있습니다.</p>
            <CodeBlock>{`사람은 {"이름" : "철수", "나이" : 20} 이다.
(길이(사람))를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`2`}</CodeBlock>

            <h2>주의사항</h2>
            <ul>
                <li>없는 키로 값을 읽으면 오류가 발생합니다 (배열의 범위 초과와 비슷합니다).</li>
                <li>키는 문자열뿐 아니라 숫자도 쓸 수 있습니다 (<code>{'{1 : "하나"}'}</code>).</li>
                <li>값 자리에는 배열, 사전을 포함해 어떤 값이든 넣을 수 있습니다.</li>
            </ul>
            <CodeBlock>{`사람은 {"이름" : "철수"} 이다.
(사람["나이"])를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`[오류] 사전에 없는 키입니다: 나이`}</CodeBlock>
        </article>
    );
}
