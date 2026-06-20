import type { Metadata } from 'next'
import './globals.css'
import RecoilRootWrapper from '../../wrappers/RecoilRootWrapper'
import Header from '../../components/layout/header'
import Footer from '../../components/layout/footer'

export const metadata: Metadata = {
    title: '한랭 han-lang',
    description: '한국어로 코딩하는 프로그래밍 언어',
}

export default function RootLayout(
    {children,}:
    {children: React.ReactNode}) {

    return (
        <html lang="ko">
            <head>
                <link rel="icon" href="/icon/favicon.ico" sizes="any" />
                <link rel="icon" type="image/png" sizes="32x32" href="/icon/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/icon/favicon-16x16.png" />
                <link rel="apple-touch-icon" href="/icon/apple-touch-icon.png" />
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
                />
            </head>
            <body>
                <RecoilRootWrapper>
                    <Header />
                    <div>
                        {children}
                    </div>
                    <Footer />
                </RecoilRootWrapper>
            </body>
        </html>
    )
}