import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import styles from './ListEditor.module.css';

interface ListEditorProps {
    title: string;
    items: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
}

export function ListEditor({ title, items, onChange, placeholder = "Add item..." }: ListEditorProps) {
    const [newItem, setNewItem] = useState('');

    const handleAdd = () => {
        if (newItem.trim()) {
            onChange([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleRemove = (index: number) => {
        const updated = [...items];
        updated.splice(index, 1);
        onChange(updated);
    };

    const handleEdit = (index: number, val: string) => {
        const updated = [...items];
        updated[index] = val;
        onChange(updated);
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>{title}</h3>

            <ul className={styles.list}>
                {items.map((item, index) => (
                    <li key={index} className={styles.listItem}>
                        <div className={styles.bullet} />
                        <input
                            className={styles.itemInput}
                            value={item}
                            onChange={(e) => handleEdit(index, e.target.value)}
                        />
                        <button
                            className={styles.removeBtn}
                            onClick={() => handleRemove(index)}
                            title="Remove item"
                        >
                            <Trash2 size={14} />
                        </button>
                    </li>
                ))}
            </ul>

            <div className={styles.addForm}>
                <input
                    className={styles.addInput}
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                />
                <button
                    className={styles.addBtn}
                    onClick={handleAdd}
                    disabled={!newItem.trim()}
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}
