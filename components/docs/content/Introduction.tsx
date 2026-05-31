"use client";

import CodeBlock from "../CodeBlock";

export default function Introduction() {
    return (
        <article>
            <h1>한랭 (han-lang)</h1>
            <p>
                한랭은 <strong>한국어 문법으로 코딩하는 프로그래밍 언어</strong>입니다.
                영어를 몰라도 프로그래밍의 기본 개념(변수, 조건, 반복)을 익힐 수 있도록 설계되었습니다.
            </p>
            <p>
                기초를 한랭으로 배운 뒤 다른 언어(Python, Java, C++ 등)로 쉽게 전환할 수 있는
                징검다리 역할을 목표로 합니다.
            </p>

            <h2>특징</h2>
            <ul>
                <li>한국어 키워드 사용 (<code>이다</code>, <code>만약</code>, <code>동안</code> 등)</li>
                <li>들여쓰기로 블록 구분 (Tab 또는 4칸 스페이스)</li>
                <li>조사 자동 인식 — <code>사과는</code>, <code>자두가</code> 처럼 자연스럽게 작성 가능</li>
                <li>브라우저에서 바로 실행</li>
            </ul>

            <h2>빠른 시작</h2>
            <p>아래 코드를 에디터에 붙여넣고 <strong>▶ 실행</strong> 버튼을 누르세요.</p>
            <CodeBlock>{`이름은 "세계" 이다.
("안녕, ", 이름)을 출력한다.`}</CodeBlock>
            <p>출력:</p>
            <CodeBlock variant="output">{`안녕,  세계`}</CodeBlock>

            <h2>언어 구조 한눈에 보기</h2>
            <CodeBlock>{`// 변수 선언과 초기화
사과는 3 이다.
인삿말은 "안녕하세요!" 이다.

// 출력
(인삿말)를 출력한다.

// 조건문
만약 (사과 < 10) 라면
\t("사과가 10보다 작아요")를 출력한다.
아니면
\t("사과가 10 이상이에요")를 출력한다.

// 반복문
인덱스는 1 이다.
(인덱스 < 4) 동안
\t(인덱스)를 출력한다.
\t인덱스는 인덱스 + 1 이다.`}</CodeBlock>
        </article>
    );
}
