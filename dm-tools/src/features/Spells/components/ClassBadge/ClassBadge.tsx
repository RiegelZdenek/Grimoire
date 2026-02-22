import React from 'react';
import styles from './ClassBadge.module.css';
import { HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

import ArtificerIcon from '../../../../assets/class_icons/Class Icon - Artificer.svg';
import BarbarianIcon from '../../../../assets/class_icons/Class Icon - Barbarian.svg';
import BardIcon from '../../../../assets/class_icons/Class Icon - Bard.svg';
import ClericIcon from '../../../../assets/class_icons/Class Icon - Cleric.svg';
import DruidIcon from '../../../../assets/class_icons/Class Icon - Druid.svg';
import FighterIcon from '../../../../assets/class_icons/Class Icon - Fighter.svg';
import MonkIcon from '../../../../assets/class_icons/Class Icon - Monk.svg';
import PaladinIcon from '../../../../assets/class_icons/Class Icon - Paladin.svg';
import RangerIcon from '../../../../assets/class_icons/Class Icon - Ranger.svg';
import RogueIcon from '../../../../assets/class_icons/Class Icon - Rogue.svg';
import SorcererIcon from '../../../../assets/class_icons/Class Icon - Sorcerer.svg';
import WarlockIcon from '../../../../assets/class_icons/Class Icon - Warlock.svg';
import WizardIcon from '../../../../assets/class_icons/Class Icon - Wizard.svg';

interface ClassBadgeProps {
    className: string;
    isSelected: boolean;
    onClick: () => void;
}

const getClassIconSrc = (className: string) => {
    switch (className.toLowerCase()) {
        case 'artificer': return ArtificerIcon;
        case 'barbarian': return BarbarianIcon;
        case 'bard': return BardIcon;
        case 'cleric': return ClericIcon;
        case 'druid': return DruidIcon;
        case 'fighter': return FighterIcon;
        case 'monk': return MonkIcon;
        case 'paladin': return PaladinIcon;
        case 'ranger': return RangerIcon;
        case 'rogue': return RogueIcon;
        case 'sorcerer': return SorcererIcon;
        case 'warlock': return WarlockIcon;
        case 'wizard': return WizardIcon;
        default: return null;
    }
};

const getClassColorVar = (className: string) => {
    switch (className.toLowerCase()) {
        case 'wizard': return '#3b82f6'; // Blue
        case 'bard': return '#d946ef'; // Pink/Purple
        case 'cleric': return '#e2e8f0'; // Silver
        case 'druid': return '#22c55e'; // Green
        case 'paladin': return '#eab308'; // Gold
        case 'ranger': return '#15803d'; // Dark Green
        case 'sorcerer': return '#ef4444'; // Red
        case 'warlock': return '#a855f7'; // Purple
        default: return 'var(--text-secondary)';
    }
};

export const ClassBadge: React.FC<ClassBadgeProps> = ({ className, isSelected, onClick }) => {
    const colorVar = getClassColorVar(className);
    const iconSrc = getClassIconSrc(className);

    return (
        <button
            className={clsx(styles.badge, isSelected && styles.selected)}
            onClick={onClick}
            style={{
                '--badge-color': colorVar,
            } as React.CSSProperties}
            title={className}
        >
            <div className={styles.iconWrapper}>
                {iconSrc ? (
                    <div
                        className={styles.svgIcon}
                        style={{
                            maskImage: `url("${iconSrc}")`,
                            WebkitMaskImage: `url("${iconSrc}")`
                        }}
                    />
                ) : (
                    <HelpCircle size={18} />
                )}
            </div>
        </button>
    );
};
