import Editor from '../../components/main/editor'
import Terminal from '../../components/main/terminal'
import styles from './page.module.css'

export default function Home() {
    return (
        <main className={styles.main}>
            hello world
            <div className={}>
                <Editor />
                <Terminal />
            </div>
            

            <a href={`/docs`}>docs</a>
            <a href={`/log`}>devlog</a>
        </main>
    )
}