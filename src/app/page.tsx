import Editor from '../../components/main/editor';
import Terminal from '../../components/main/terminal';

export default function Home() {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Editor />
        <Terminal />
      </div>
    </main>
  );
}
