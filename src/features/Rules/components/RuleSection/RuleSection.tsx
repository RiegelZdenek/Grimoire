import React from 'react';
import type { LucideIcon } from 'lucide-react';
import styles from './RuleSection.module.css';

interface RuleSectionProps {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

export const RuleSection: React.FC<RuleSectionProps> = ({ title, icon: Icon, children }) => {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Icon size={24} className={styles.icon} />
                </div>
                <h2 className={styles.title}>{title}</h2>
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </section>
    );
};
