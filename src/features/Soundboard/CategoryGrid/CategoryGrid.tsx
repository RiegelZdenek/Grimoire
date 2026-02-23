import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import type { Category } from '../useSoundboard';
import styles from './CategoryGrid.module.css';

interface CategoryGridProps {
    categories: Category[];
    activeCategoryId?: string;
    onSelectCategory: (id: string) => void;
}

export function CategoryGrid({ categories, activeCategoryId, onSelectCategory }: CategoryGridProps) {
    return (
        <div className={styles.grid}>
            {categories.map((category) => {
                const Icon = Icons[category.icon as keyof typeof Icons] as LucideIcon;
                const isActive = category.id === activeCategoryId;

                return (
                    <button
                        key={category.id}
                        className={clsx(styles.tile, { [styles.active]: isActive })}
                        onClick={() => onSelectCategory(category.id)}
                    >
                        <div className={styles.iconContainer}>
                            {Icon && <Icon size={64} strokeWidth={1.5} />}
                        </div>
                        <span className={styles.label}>{category.title}</span>
                        <div className={styles.ripple} />
                    </button>
                );
            })}
        </div>
    );
}
