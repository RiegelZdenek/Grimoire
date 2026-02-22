import { type LucideIcon, Music, Users, Skull, BookOpen, Package, Shield, Map, Swords } from 'lucide-react';
import clsx from 'clsx';
import type { Tab } from '../../../App';
import styles from './Sidebar.module.css';

interface SidebarProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

interface NavItem {
    id: Tab;
    label: string;
    icon: LucideIcon;
}

const navItems: NavItem[] = [
    { id: 'soundboard', label: 'Soundboard', icon: Music },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'bestiary', label: 'Bestiary', icon: Skull },
    { id: 'spells', label: 'Spells', icon: BookOpen },
    { id: 'weapons', label: 'Weapons', icon: Swords },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'rules', label: 'Rules', icon: Shield },
    { id: 'maps', label: 'Maps', icon: Map },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    return (
        <nav className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>D&D</div>
            </div>

            <ul className={styles.navList}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <li key={item.id} className={styles.navItem}>
                            <button
                                className={clsx(styles.navButton, { [styles.active]: isActive })}
                                onClick={() => onTabChange(item.id)}
                                aria-label={item.label}
                                title={item.label}
                            >
                                <div className={styles.iconWrapper}>
                                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={styles.label}>{item.label}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
