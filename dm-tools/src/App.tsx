import { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar/Sidebar';
import styles from './App.module.css';
import { Soundboard } from './features/Soundboard/Soundboard';
import { Placeholders } from './features/Placeholders/Placeholders';
import { PlayerSheets } from './features/PlayerSheets/PlayerSheets';

export type Tab = 'soundboard' | 'players' | 'bestiary' | 'spells' | 'items' | 'rules' | 'maps';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('soundboard');

  return (
    <div className={styles.appContainer}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={styles.mainContent}>
        {activeTab === 'soundboard' && <Soundboard />}
        {activeTab === 'players' && <PlayerSheets />}
        {activeTab === 'bestiary' && <Placeholders title="Bestiary" icon="Skull" />}
        {activeTab === 'spells' && <Placeholders title="Spells" icon="BookOpen" />}
        {activeTab === 'items' && <Placeholders title="Items" icon="Package" />}
        {activeTab === 'rules' && <Placeholders title="Quick Rules" icon="Shield" />}
        {activeTab === 'maps' && <Placeholders title="Maps" icon="Map" />}
      </main>
    </div>
  );
}

export default App;
