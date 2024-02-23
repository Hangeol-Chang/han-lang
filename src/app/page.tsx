import styles from './page.module.css'

export default function Home() {
    return (
        <main className={styles.main}>
            hello world

            <a href={`/docs`}>docs</a>
            <a href={`/log`}>devlog</a>
        </main>
    )
}