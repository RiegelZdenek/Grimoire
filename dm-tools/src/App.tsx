import { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar/Sidebar';
import styles from './App.module.css';
import { Soundboard } from './features/Soundboard/Soundboard';
import { Placeholders } from './features/Placeholders/Placeholders';
import { PlayerSheets } from './features/PlayerSheets/PlayerSheets';
import { Spells } from './features/Spells/Spells';
import { Weapons } from './features/Weapons/Weapons';
import { Rules } from './features/Rules/Rules';
import './index.css';

export type Tab = 'soundboard' | 'players' | 'bestiary' | 'spells' | 'items' | 'rules' | 'maps' | 'weapons' | 'npcs' | 'map';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('soundboard');

  // Temporarily removing placeholder imports that aren't used right now
  // import { Swords, User, Map, ScrollText, Music, Settings, Dice5 } from 'lucide-react';

  const Placeholder = ({ title, icon }: { title: string, icon?: string }) => (
    <div style={{ padding: '20px', textAlign: 'center', fontSize: '24px' }}>
      <h2>{title}</h2>
      {icon && <p>Icon: {icon}</p>}
    </div>
  );

  return (
    <div className={styles.appContainer}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={styles.mainContent}>
        <div style={{ display: activeTab === 'soundboard' ? 'block' : 'none', height: '100%' }}>
          <Soundboard />
        </div>
        {activeTab === 'players' && <PlayerSheets />}
        {activeTab === 'bestiary' && <Placeholders title="Bestiary" icon="Skull" />}
        {activeTab === 'spells' && <Spells />}
        {activeTab === 'items' && <Placeholders title="Items" icon="Package" />}
        {activeTab === 'rules' && <Rules />}
        {activeTab === 'maps' && <Placeholders title="Maps" icon="Map" />}
        {activeTab === 'weapons' && <Weapons />}
        {activeTab === 'npcs' && <Placeholder title="NPCs & Encounters" />}
        {activeTab === 'map' && <Placeholder title="Interactive Map" />}
      </main>
    </div>
  );
}

export default App;


