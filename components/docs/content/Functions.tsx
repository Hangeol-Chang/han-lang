"use client";

import CodeBlock from "../CodeBlock";

export default function Functions() {
    return (
        <article>
            <h1>함수</h1>
            <p>반복해서 쓰는 코드를 이름 붙여 모아두고, 필요할 때마다 불러 쓰는 기능입니다.</p>

            <h2>함수 정의</h2>
            <CodeBlock>{`함수 함수이름(매개변수1, 매개변수2)
\t// 실행할 코드
\t(결과값)를 반환한다.`}</CodeBlock>
            <ul>
                <li><code>함수</code> 키워드로 시작합니다.</li>
                <li>매개변수는 괄호 안에 쉼표로 구분해 나열합니다 (없어도 됩니다).</li>
                <li>본문은 <strong>탭(Tab)</strong>으로 들여씁니다.</li>
                <li>값을 돌려주려면 <code>(값)를 반환한다.</code>를 사용합니다.</li>
            </ul>

            <h2>정의하고 호출하기</h2>
            <CodeBlock>{`함수 더하기(a, b)
\t(a + b)를 반환한다.

합은 더하기(3, 4) 이다.
(합)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`7`}</CodeBlock>

            <h2>반환값 없는 함수</h2>
            <p>
                <code>반환한다</code>를 쓰지 않으면 함수는 <code>정의되지않음</code>을 돌려줍니다.
                출력처럼 결과가 필요 없는 동작에 적합합니다.
            </p>
            <CodeBlock>{`함수 인사하기(이름)
\t("%s님, 안녕하세요!\n", 이름)를 출력한다.

인사하기("철수")`}</CodeBlock>
            <CodeBlock variant="output">{`철수님, 안녕하세요!`}</CodeBlock>

            <h2>먼저 호출하고 나중에 정의하기</h2>
            <p>함수는 코드의 어느 위치에서 정의하든 그 전에 호출할 수 있습니다.</p>
            <CodeBlock>{`값은 곱하기(3, 4) 이다.
(값)를 출력한다.

함수 곱하기(a, b)
\t(a * b)를 반환한다.`}</CodeBlock>
            <CodeBlock variant="output">{`12`}</CodeBlock>

            <h2>재귀 호출</h2>
            <p>함수 안에서 자기 자신을 다시 호출할 수 있습니다.</p>
            <CodeBlock>{`함수 팩토리얼(n)
\t만약 (n <= 1) 라면
\t\t(1)를 반환한다.
\t(n * 팩토리얼(n - 1))를 반환한다.

결과는 팩토리얼(5) 이다.
(결과)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`120`}</CodeBlock>

            <h2>주의사항</h2>
            <ul>
                <li>
                    함수 안에서는 <strong>매개변수만</strong> 사용할 수 있습니다.
                    함수 밖의 변수는 함수 안에서 보이지 않습니다 (독립된 영역).
                </li>
                <li>전달한 인자 개수가 매개변수 개수와 다르면 오류가 발생합니다.</li>
                <li>재귀 호출이 너무 깊어지면(약 1,000단계) 무한 재귀로 보고 실행을 중단합니다.</li>
            </ul>
            <CodeBlock>{`함수 더하기(a, b)
\t(a + b)를 반환한다.

값은 더하기(1) 이다.`}</CodeBlock>
            <CodeBlock variant="output">{`[오류] 함수 "더하기"는 매개변수 2개가 필요합니다 (받은 값: 1개)`}</CodeBlock>
        </article>
    );
}
