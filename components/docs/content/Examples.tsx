"use client";

import CodeBlock from "../CodeBlock";

export default function Examples() {
    return (
        <article>
            <h1>예제 모음</h1>
            <p>한랭의 기능을 종합적으로 활용하는 예제들입니다. 에디터에 붙여넣고 실행해 보세요.</p>

            <h2>구구단 (2단 ~ 9단)</h2>
            <CodeBlock>{`i는 2 이다.
(i <= 9) 동안
\tj는 1 이다.
\t(j <= 9) 동안
\t\t("%d x %d = %d\n", i, j, i * j)를 출력한다.
\t\tj는 j + 1 이다.
\ti는 i + 1 이다.`}</CodeBlock>

            <h2>짝수 / 홀수 판별</h2>
            <CodeBlock>{`수는 7 이다.
나머지는 수 - (수 / 2) * 2 이다.
만약 (나머지 == 0) 라면
\t("%d는 짝수\n", 수)를 출력한다.
아니면
\t("%d는 홀수\n", 수)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`7는 홀수`}</CodeBlock>

            <h2>1부터 N까지의 합</h2>
            <CodeBlock>{`n은 100 이다.
합계는 0 이다.
i는 1 이다.
(i <= n) 동안
\t합계는 합계 + i 이다.
\ti는 i + 1 이다.
("1 ~ ")를 출력한다.
(n)를 출력한다.
("까지의 합: ")를 출력한다.
(합계)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`1 ~
100
까지의 합:
5050`}</CodeBlock>

            <h2>피보나치 수열 (첫 10개)</h2>
            <CodeBlock>{`a는 0 이다.
b는 1 이다.
i는 0 이다.
(i < 10) 동안
\t(a)를 출력한다.
\t다음은 a + b 이다.
\ta는 b 이다.
\tb는 다음 이다.
\ti는 i + 1 이다.`}</CodeBlock>
            <CodeBlock variant="output">{`0
1
1
2
3
5
8
13
21
34`}</CodeBlock>

            <h2>간단한 성적 분류</h2>
            <CodeBlock>{`점수는 78 이다.
만약 (점수 >= 90) 이면
\t("A 등급")를 출력한다.
아니면
\t만약 (점수 >= 80) 이면
\t\t("B 등급")를 출력한다.
\t아니면
\t\t만약 (점수 >= 70) 이면
\t\t\t("C 등급")를 출력한다.
\t\t아니면
\t\t\t("D 등급")를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`C 등급`}</CodeBlock>

            <h2>별 찍기</h2>
            <CodeBlock>{`i는 1 이다.
(i <= 5) 동안
\tj는 0 이다.
\t줄은 "" 이다.
\t(j < i) 동안
\t\t줄은 줄 + "*" 이다.
\t\tj는 j + 1 이다.
\t(줄)를 출력한다.
\ti는 i + 1 이다.`}</CodeBlock>
            <CodeBlock variant="output">{`*
**
***
****
*****`}</CodeBlock>
        </article>
    );
}
