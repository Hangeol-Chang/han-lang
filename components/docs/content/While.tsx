"use client";

import CodeBlock from "../CodeBlock";

export default function While() {
    return (
        <article>
            <h1>반복문</h1>
            <p>조건이 참인 동안 같은 코드를 반복 실행합니다.</p>

            <h2>기본 문법</h2>
            <CodeBlock>{`(조건) 동안
\t// 반복할 코드`}</CodeBlock>
            <ul>
                <li>조건을 <code>( )</code>로 감싸고 뒤에 <code>동안</code>을 씁니다.</li>
                <li>반복할 코드는 <strong>탭(Tab)</strong>으로 들여씁니다.</li>
                <li>조건이 처음부터 거짓이면 한 번도 실행되지 않습니다.</li>
            </ul>

            <h2>예제 — 1부터 5까지 출력</h2>
            <CodeBlock>{`i는 1 이다.
(i <= 5) 동안
\t(i)를 출력한다.
\ti는 i + 1 이다.`}</CodeBlock>
            <CodeBlock variant="output">{`1
2
3
4
5`}</CodeBlock>

            <h2>예제 — 합계 계산</h2>
            <CodeBlock>{`합계는 0 이다.
i는 1 이다.
(i <= 10) 동안
\t합계는 합계 + i 이다.
\ti는 i + 1 이다.
("1~10 합계: ")를 출력한다.
(합계)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`1~10 합계:
55`}</CodeBlock>

            <h2>예제 — 중첩 반복문 (구구단)</h2>
            <CodeBlock>{`i는 2 이다.
(i <= 9) 동안
\tj는 1 이다.
\t(j <= 9) 동안
\t\t("%d x %d = %d\n", i, j, i * j)를 출력한다.
\t\tj는 j + 1 이다.
\ti는 i + 1 이다.`}</CodeBlock>
            <CodeBlock variant="output">{`2 x 1 = 2
2 x 2 = 4
...`}</CodeBlock>

            <h2>주의 — 무한 루프</h2>
            <p>
                반복문 안에서 조건이 절대 거짓이 되지 않으면 <strong>무한 루프</strong>가 발생합니다.
                한랭은 <strong>10,000회</strong> 반복을 넘으면 자동으로 실행을 중단하고 오류 메시지를 출력합니다.
            </p>
            <CodeBlock>{`// 이 코드는 무한 루프입니다 (i가 증가하지 않음)
i는 1 이다.
(i < 10) 동안
\t("반복 중")를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`[오류: 무한 루프가 감지되어 실행을 중단했습니다]`}</CodeBlock>
        </article>
    );
}
