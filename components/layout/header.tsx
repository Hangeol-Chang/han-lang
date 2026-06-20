import Link from 'next/link'
import ThemeToggle from '../Common/ThemeToggle'

export default function Header() {
    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            height: '56px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-elevated)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.2rem' }}>
                    <img src="/icon/favicon-32x32.png" alt="한랭 로고" width={28} height={28} style={{ filter: 'var(--logo-filter)' }} />
                    한랭
                </Link>
                <ThemeToggle />
            </div>
            <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem' }}>
                <Link href="/" style={{ color: 'var(--text-secondary)' }}>에디터</Link>
                <Link href="/docs" style={{ color: 'var(--text-secondary)' }}>문서</Link>
                <Link href="/log" style={{ color: 'var(--text-secondary)' }}>로그</Link>
            </nav>
        </header>
    )
}
