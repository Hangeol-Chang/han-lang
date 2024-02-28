import Editor from '../../components/main/editor'
import Terminal from '../../components/main/terminal'
import styles from './page.module.css'

export default function Home() {
    
    const MainStyle = {
        display : 'flex',
        justifyContent : 'center'
        
    } as React.CSSProperties;

    return (
        <main className={``}
            style={{backgroundColor: '#eee'}}>
            hello world
            <div className={``} style={MainStyle} >
                <Editor />
                <Terminal />
            </div>
            
            <a href={`/log`}>devlog</a>
        </main>
    )
}