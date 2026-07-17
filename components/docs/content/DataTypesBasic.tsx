"use client";

import CodeBlock from "../CodeBlock";

export default function DataTypesBasic() {
    return (
        <article>
            <h1>자료형 — 기본</h1>
            <p>숫자와 불리언처럼 한랭에서 가장 기본이 되는 값의 종류입니다. 배열, 문자열, 사전은 왼쪽 메뉴의 각 탭에서 자세히 다룹니다.</p>

            <h2>숫자</h2>
            <p>정수와 소수 모두 사용할 수 있습니다. 별도의 타입 선언 없이 그냥 씁니다.</p>
            <CodeBlock>{`정수는 42 이다.
소수는 3.14 이다.
음수는 -7 이다.`}</CodeBlock>
            <p>사칙연산과 나머지 연산이 가능합니다.</p>
            <CodeBlock>{`합은 10 + 3 이다.      // 13
차는 10 - 3 이다.      // 7
곱은 10 * 3 이다.      // 30
나눗셈은 10 / 3 이다.  // 3.333...
나머지는 10 % 3 이다.  // 1`}</CodeBlock>

            <h2>불리언 (참/거짓)</h2>
            <p><code>진실</code>과 <code>거짓</code> 두 가지 값만 있습니다.</p>
            <CodeBlock>{`정답은 진실 이다.
오답은 거짓 이다.

만약 (정답 == 진실) 라면
\t("맞아요!")를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`맞아요!`}</CodeBlock>

            <h2>정의되지 않은 값</h2>
            <p><code>있다</code>로만 선언하고 값을 넣지 않으면 출력 시 <code>정의되지않음</code>으로 표시됩니다.</p>
            <CodeBlock>{`결과가 있다.
(결과)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`정의되지않음`}</CodeBlock>
        </article>
    );
}
