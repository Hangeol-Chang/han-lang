"use client";

import CodeBlock from "../CodeBlock";

export default function Strings() {
    return (
        <article>
            <h1>자료형 — 문자열</h1>
            <p>큰따옴표(<code>{'"'}</code>)로 감싼 텍스트입니다.</p>

            <h2>문자열 만들기</h2>
            <CodeBlock>{`이름은 "홍길동" 이다.
빈문자는 "" 이다.`}</CodeBlock>

            <h2>이스케이프 문자</h2>
            <table>
                <thead>
                    <tr><th>표기</th><th>의미</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>\n</code></td><td>줄바꿈</td></tr>
                    <tr><td><code>\t</code></td><td>탭</td></tr>
                    <tr><td><code>{'\\"'}</code></td><td>큰따옴표 문자</td></tr>
                    <tr><td><code>{"\\'"}</code></td><td>작은따옴표 문자</td></tr>
                </tbody>
            </table>
            <CodeBlock>{`인삿말은 "안녕!\n반가워요!" 이다.
(인삿말)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`안녕!
반가워요!`}</CodeBlock>

            <h2>문자열 + 숫자 연결</h2>
            <p><code>+</code> 연산자로 문자열과 다른 값을 이어 붙일 수 있습니다.</p>
            <CodeBlock>{`나이는 20 이다.
메시지는 "나이: " + 나이 이다.
(메시지)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`나이: 20`}</CodeBlock>

            <h2>길이 구하기 — <code>길이()</code></h2>
            <p>배열, 사전과 마찬가지로 <code>길이()</code>로 문자 개수를 구할 수 있습니다.</p>
            <CodeBlock>{`인사는 "안녕하세요" 이다.
(길이(인사))를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`5`}</CodeBlock>

            <h2>동사형 함수 문법</h2>
            <p>
                아래 두 함수는 <code>(인자, ...)를 동사한다</code> 형태로 씁니다.
                <code>출력한다</code>/<code>입력받는다</code>처럼 동사 자체가 문장을 끝맺으므로,
                대입할 때도 뒤에 <code>이다</code>를 <strong>따로 붙이지 않습니다</strong> (붙이면 어미가 중복됩니다).
                값을 <strong>돌려주는</strong> 함수라서 대입문 오른쪽이나 <code>출력한다</code>의 인자, 다른 식 안에 자유롭게 중첩해서 쓸 수 있습니다.
            </p>
            <CodeBlock>{`// 대입문 오른쪽에 사용 — 동사가 문장을 끝맺으므로 "이다" 없음
결과는 ("  사과  ")를 공백제거한다.

// 다른 식 안에 바로 중첩
((" 배 ")를 공백제거한다)를 출력한다.`}</CodeBlock>

            <h2>공백 제거 — <code>공백제거한다</code></h2>
            <p>문자열 앞뒤에 붙은 공백(스페이스, 탭, 줄바꿈)을 제거합니다. 문자열 <strong>중간</strong>의 공백은 그대로 남습니다.</p>
            <CodeBlock>{`결과는 ("  사과 나무  ")를 공백제거한다.
(결과)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`사과 나무`}</CodeBlock>
            <p>입력값 다듬기에 자주 씁니다.</p>
            <CodeBlock>{`문자열이 있다.
문자열을 입력받는다.
다듬은값은 (문자열)를 공백제거한다.
(다듬은값)를 출력한다.`}</CodeBlock>

            <h2>부분 문자열 — <code>부분문자열화한다</code></h2>
            <p>
                <code>(문자열, 시작, 끝)를 부분문자열화한다</code> — 시작 인덱스는 <strong>포함</strong>,
                끝 인덱스는 <strong>미포함</strong>입니다. 인덱스는 0부터 시작합니다.
            </p>
            <CodeBlock>{`문장은 "나는 사과를 먹는다" 이다.
부분은 (문장, 2, 5)를 부분문자열화한다.
(부분)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`(공백)사과`}</CodeBlock>
            <p>인덱스: <code>나(0) 는(1) (공백)(2) 사(3) 과(4) 를(5) ...</code> → 2번부터 5번 직전까지 잘라내므로 <code>(공백)사과</code>가 됩니다.</p>

            <h3>끝 인덱스 생략</h3>
            <p>끝 인덱스를 생략하면 문자열 끝까지 잘라냅니다.</p>
            <CodeBlock>{`문장은 "나는 사과를 먹는다" 이다.
뒷부분은 (문장, 6)를 부분문자열화한다.
(뒷부분)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`먹는다`}</CodeBlock>

            <h3>주의사항</h3>
            <ul>
                <li>배열의 인덱스 접근과 달리, 범위를 벗어난 인덱스를 줘도 오류가 나지 않고 빈 문자열이나 잘린 결과를 돌려줍니다.</li>
                <li>음수 인덱스는 문자열 끝에서부터 센 위치로 취급됩니다 (예: <code>-1</code>은 마지막 글자).</li>
                <li>첫 번째 인자는 반드시 문자열이어야 합니다. 숫자를 넣으려면 <code>문자열()</code>로 먼저 변환하세요.</li>
            </ul>

            <h2>접두/접미 확인 — <code>시작한다</code> / <code>끝난다</code></h2>
            <p>
                <code>(문자열, 대상)를 시작한다</code>는 문자열이 대상으로 <strong>시작하는지</strong>,
                <code>(문자열, 대상)를 끝난다</code>는 <strong>끝나는지</strong>를 <code>진실</code>/<code>거짓</code>으로 돌려줍니다.
            </p>
            <CodeBlock>{`문장은 "나는 사과를 먹는다" 이다.
결과1은 (문장, "나는")를 시작한다.
결과2는 (문장, "먹는다")를 끝난다.
(결과1)를 출력한다.
(결과2)를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`true
true`}</CodeBlock>
            <p>조건문과 함께 자주 씁니다.</p>
            <CodeBlock>{`문장은 "사과나무" 이다.
만약 ((문장, "사과")를 시작한다) 라면
\t("사과 계열입니다")를 출력한다.`}</CodeBlock>
            <CodeBlock variant="output">{`사과 계열입니다`}</CodeBlock>
        </article>
    );
}
