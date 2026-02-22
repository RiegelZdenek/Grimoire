import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import styles from './Placeholders.module.css';

interface PlaceholdersProps {
    title: string;
    icon: keyof typeof Icons;
}

export function Placeholders({ title, icon }: PlaceholdersProps) {
    // Dynamically grab the icon from lucide-react based on the string name
    const IconComponent = Icons[icon] as LucideIcon;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    {IconComponent && <IconComponent size={64} strokeWidth={1.5} />}
                </div>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>
                    This tool is currently being forged by the artificers. Check back later!
                </p>
            </div>
        </div>
    );
}
