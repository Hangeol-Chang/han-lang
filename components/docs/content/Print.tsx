"use client";

import CodeBlock from "../CodeBlock";

export default function Print() {
    return (
        <article>
            <h1>출력</h1>
            <p>값을 화면에 표시할 때 사용합니다. 기본 문법은 아래와 같습니다.</p>
            <CodeBlock>{`(출력할 값)를 출력한다.`}</CodeBlock>
            <p>괄호 안에 변수나 값을 넣고, 뒤에 조사(<code>를/을</code>)와 <code>출력한다</code>를 붙입니다. 조사는 생략 가능합니다.</p>

            <h2>변수 출력</h2>
            <CodeBlock>{`사과는 5 이다.
(사과)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`5`}</CodeBlock>

            <h2>문자열 직접 출력</h2>
            <CodeBlock>{`("Hello, World!")를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`Hello, World!`}</CodeBlock>

            <h2>여러 값 한 번에 출력</h2>
            <p>쉼표로 구분해 여러 값을 넣으면 공백으로 이어 붙여 출력합니다.</p>
            <CodeBlock>{`이름은 "철수" 이다.
나이는 15 이다.
(이름, 나이)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`철수 15`}</CodeBlock>

            <h2>형식 지정 출력 (printf 스타일)</h2>
            <p>
                첫 번째 인자에 <code>%d</code>(정수), <code>%s</code>(문자열) 형식 지정자를 사용하면
                C언어의 <code>printf</code>처럼 동작합니다.
            </p>
            <table>
                <thead>
                    <tr><th>지정자</th><th>의미</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>%d</code></td><td>정수로 출력 (소수점 버림)</td></tr>
                    <tr><td><code>%s</code></td><td>문자열로 출력</td></tr>
                </tbody>
            </table>
            <CodeBlock>{`사과는 7 이다.
이름은 "배" 이다.
("%d개의 %s\n", 사과, 이름)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`7개의 배`}</CodeBlock>

            <h2>줄바꿈 없이 출력</h2>
            <p>기본 출력은 자동으로 줄바꿈이 붙습니다. 줄바꿈 없이 출력하려면 형식 지정자 방식을 사용하세요.</p>
            <CodeBlock>{`("%s ", "하나")를 출력한다.
("%s ", "둘")를 출력한다.
("%s\n", "셋")를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`하나 둘 셋`}</CodeBlock>
        </article>
    );
}
