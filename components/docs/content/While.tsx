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

            <h1 style={{ marginTop: 40 }}>반복문 — for</h1>
            <p>몇 번 반복할지 정해져 있을 때 쓰는 카운트 반복문입니다. <code>동안</code>으로 끝맺는 건 일반 <code>while</code>과 똑같습니다 — &ldquo;무엇을 하는 동안&rdquo;이라는 어감을 그대로 유지해서, 뒤에 반복할 코드가 이어진다는 느낌이 자연스럽게 이어집니다.</p>

            <h2>기본 문법</h2>
            <CodeBlock>{`변수가 시작값부터 끝값까지 동안
\t// 반복할 코드`}</CodeBlock>
            <ul>
                <li><code>부터</code>와 <code>까지</code> 둘 다 <strong>포함</strong>됩니다 (끝값도 실행됩니다).</li>
                <li>반복할 때마다 변수에 현재 값이 자동으로 대입됩니다. 따로 <code>이다</code>로 초기화하지 않아도 됩니다.</li>
                <li>스텝(증가폭)을 생략하면 기본값 <code>1</code>씩 증가합니다.</li>
            </ul>
            <CodeBlock>{`i가 1부터 5까지 동안
\t(i)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`1
2
3
4
5`}</CodeBlock>

            <h2>스텝(증가폭) 지정 — <code>씩</code></h2>
            <p><code>끝값</code> 뒤에 <code>N씩</code>을 추가하면 한 번에 N만큼 증가합니다.</p>
            <CodeBlock>{`i가 0부터 10까지 2씩 동안
\t(i)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`0
2
4
6
8
10`}</CodeBlock>

            <h2>거꾸로 반복하기</h2>
            <p>시작값이 끝값보다 크고 스텝이 음수면 거꾸로(감소하며) 반복합니다.</p>
            <CodeBlock>{`i가 5부터 0까지 -1씩 동안
\t(i)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`5
4
3
2
1
0`}</CodeBlock>

            <h2>주의사항</h2>
            <ul>
                <li>스텝을 <code>0</code>으로 쓰면 오류가 발생합니다 (무한 루프가 되기 때문입니다).</li>
                <li>시작/끝값이 정수가 아니어도 동작하지만, 스텝만큼 증가하다 끝값을 넘으면 그 즉시 종료됩니다.</li>
                <li>일반 <code>while</code>과 마찬가지로 10,000회를 넘으면 자동으로 실행을 중단합니다.</li>
            </ul>

            <h1 style={{ marginTop: 40 }}>반복 중단 — break</h1>
            <p>반복문을 도중에 즉시 빠져나가고 싶을 때 <code>중단한다.</code>를 씁니다. <code>while</code>과 <code>for</code> 모두에서 사용할 수 있습니다.</p>
            <CodeBlock>{`i가 0부터 10까지 동안
\t만약 (i == 3) 라면
\t\t중단한다.
\t(i)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`0
1
2`}</CodeBlock>
            <p>반복문 밖이나, 반복문이 없는 함수 안에서 단독으로 쓰면 오류가 발생합니다.</p>
            <CodeBlock>{`중단한다.`}</CodeBlock>
            <CodeBlock variant="output">{`[오류] "중단한다"는 반복문 안에서만 사용할 수 있습니다`}</CodeBlock>
        </article>
    );
}
