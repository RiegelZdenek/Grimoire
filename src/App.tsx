import { useState } from 'react';
import { Menu } from 'lucide-react';
import clsx from 'clsx';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* Mobile overlay */}
      <div
        className={clsx(styles.overlay, { [styles.open]: isMobileMenuOpen })}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className={styles.mainContentWrapper}>
        <div className={styles.mobileTopBar}>
          <button
            className={styles.menuButton}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <span className={styles.mobileTitle}>Grimoire</span>
        </div>

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
    </div>
  );
}

export default App;


