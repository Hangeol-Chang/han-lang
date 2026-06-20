import IdeLayout from '../../components/main/IdeLayout';

export default function Home() {
    return (
        <main style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>
            <IdeLayout />
        </main>
    );
}
