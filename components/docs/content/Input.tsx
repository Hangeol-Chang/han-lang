"use client";

import CodeBlock from "../CodeBlock";

export default function Input() {
    return (
        <article>
            <h1>입력</h1>
            <p>사용자로부터 값을 입력받아 변수에 저장할 때 사용합니다. 트리거 단어는 <code>입력받는다</code>이며, 대상은 변수만 올 수 있습니다.</p>
            <CodeBlock>{`변수를 입력받는다.`}</CodeBlock>
            <p>실행하면 브라우저의 입력창이 뜹니다. 입력한 값이 숫자로 해석되면 숫자로, 아니면 문자열로 저장됩니다. 아무것도 입력하지 않으면 <code>정의되지않음</code>이 저장됩니다.</p>

            <h2>변수 하나 입력받기</h2>
            <p>미리 <code>있다</code>로 선언해 둔 변수에 값을 입력받을 수 있습니다. 조사(<code>를/을</code>)는 생략 가능합니다.</p>
            <CodeBlock>{`사과가 있다.
사과를 입력받는다.
(사과)를 출력한다.`}</CodeBlock>

            <h2>괄호를 이용한 입력</h2>
            <p>출력문과 마찬가지로 괄호로 감싸서 써도 동일하게 동작합니다.</p>
            <CodeBlock>{`사과가 있다.
(사과)를 입력받는다.`}</CodeBlock>

            <h2>여러 변수 한 번에 입력받기</h2>
            <p>변수를 나열하면 입력창이 순서대로 여러 번 뜨며, 각 변수에 차례로 저장됩니다.</p>
            <CodeBlock>{`사과가 있다.
배가 있다.
사과와 배를 입력받는다.
(사과, 배)를 출력한다.`}</CodeBlock>

            <p>괄호와 쉼표로 나열해도 동일합니다.</p>
            <CodeBlock>{`사과가 있다.
배가 있다.
(사과, 배)를 입력받는다.`}</CodeBlock>

            <h2>지원되는 문법 정리</h2>
            <table>
                <thead>
                    <tr><th>형태</th><th>예시</th></tr>
                </thead>
                <tbody>
                    <tr><td>괄호 없음, 단일 변수</td><td><code>사과를 입력받는다.</code></td></tr>
                    <tr><td>괄호, 단일 변수</td><td><code>(사과)를 입력받는다.</code></td></tr>
                    <tr><td>괄호 없음, 여러 변수</td><td><code>사과와 배를 입력받는다.</code></td></tr>
                    <tr><td>괄호, 여러 변수</td><td><code>(사과, 배)를 입력받는다.</code></td></tr>
                </tbody>
            </table>

            <blockquote>입력 대상은 반드시 변수(선언되어 있거나, 새로 선언될 이름)여야 합니다. 숫자·문자열 같은 값이나 수식은 입력 대상으로 쓸 수 없습니다.</blockquote>
        </article>
    );
}
