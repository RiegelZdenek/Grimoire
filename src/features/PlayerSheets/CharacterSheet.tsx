import type { Character, AbilityScores, Passives, InventoryItem, CharacterItem, Weapon, Spell } from './types';
import { ListEditor } from './ListEditor';
import { Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import styles from './CharacterSheet.module.css';

interface CharacterSheetProps {
    character: Character;
    onUpdate: (updated: Character) => void;
}

export function CharacterSheet({ character, onUpdate }: CharacterSheetProps) {
    const SKILLS: Record<keyof AbilityScores, string[]> = {
        str: ['Athletics'],
        dex: ['Acrobatics', 'Sleight of Hand', 'Stealth'],
        con: [],
        int: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'],
        wis: ['Animal', 'Insight', 'Medicine', 'Perception', 'Survival'],
        cha: ['Deception', 'Intimidation', 'Performance', 'Persuasion']
    };

    // Helper to deeply update nested objects
    const handleChange = (field: keyof Character, value: any) => {
        onUpdate({ ...character, [field]: value });
    };

    const handleAbilityScoreChange = (score: keyof AbilityScores, value: number) => {
        onUpdate({
            ...character,
            abilityScores: { ...character.abilityScores, [score]: value }
        });
    };

    const handlePassiveChange = (passive: keyof Passives, value: number) => {
        onUpdate({
            ...character,
            passives: { ...character.passives, [passive]: value }
        });
    };

    const handleProficienciesChange = (newProfs: string[]) => {
        handleChange('proficiencies', newProfs);
    };

    const toggleSkillProficiency = (skillName: string) => {
        const isProficient = character.proficiencies.includes(skillName);
        if (isProficient) {
            handleChange('proficiencies', character.proficiencies.filter(s => s !== skillName));
        } else {
            handleChange('proficiencies', [...character.proficiencies, skillName]);
        }
    };

    // --- Feats Handlers ---
    const addFeat = () => {
        const newFeat: CharacterItem = { id: crypto.randomUUID(), name: 'New Feat', description: '' };
        handleChange('feats', [...character.feats, newFeat]);
    };

    const updateFeat = (index: number, field: keyof CharacterItem, val: string) => {
        const updated = [...character.feats];
        updated[index] = { ...updated[index], [field]: val };
        handleChange('feats', updated);
    };

    const removeFeat = (index: number) => {
        const updated = [...character.feats];
        updated.splice(index, 1);
        handleChange('feats', updated);
    };

    // --- Inventory Handlers ---
    const addInventoryItem = () => {
        const newItem: InventoryItem = { id: crypto.randomUUID(), name: 'New Item', quantity: 1, weight: 0 };
        handleChange('inventory', [...character.inventory, newItem]);
    };

    const updateInventoryItem = (index: number, field: keyof InventoryItem, val: string | number) => {
        const updated = [...character.inventory];
        updated[index] = { ...updated[index], [field]: val };
        handleChange('inventory', updated);
    };

    const removeInventoryItem = (index: number) => {
        const updated = [...character.inventory];
        updated.splice(index, 1);
        handleChange('inventory', updated);
    };

    // --- Weapons Handlers ---
    const addWeapon = () => {
        const newWep: Weapon = { id: crypto.randomUUID(), name: 'New Weapon', attackBonus: '+0', damage: '1d4', type: 'Slashing' };
        handleChange('weapons', [...(character.weapons || []), newWep]);
    };

    const updateWeapon = (index: number, field: keyof Weapon, val: string) => {
        const updated = [...(character.weapons || [])];
        updated[index] = { ...updated[index], [field]: val };
        handleChange('weapons', updated);
    };

    const removeWeapon = (index: number) => {
        const updated = [...(character.weapons || [])];
        updated.splice(index, 1);
        handleChange('weapons', updated);
    };

    // --- Spells Handlers ---
    const addSpell = () => {
        const newSpell: Spell = { id: crypto.randomUUID(), name: 'New Spell', level: 0, castingTime: '1 Action', range: '60ft', duration: 'Inst', description: '' };
        handleChange('spells', [...(character.spells || []), newSpell]);
    };

    const updateSpell = (index: number, field: keyof Spell, val: string | number) => {
        const updated = [...(character.spells || [])];
        updated[index] = { ...updated[index], [field]: val };
        handleChange('spells', updated);
    };

    const removeSpell = (index: number) => {
        const updated = [...(character.spells || [])];
        updated.splice(index, 1);
        handleChange('spells', updated);
    };

    // Calculate ability modifiers
    const getModifier = (score: number) => Math.floor((score - 10) / 2);
    const formatMod = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);

    const totalWeight = character.inventory.reduce((sum, item) => sum + (item.weight * item.quantity), 0);

    return (
        <div className={styles.sheetContainer}>

            {/* --- HEADER --- */}
            <header className={styles.header}>
                <div className={styles.nameBlock}>
                    <input
                        className={styles.nameInput}
                        value={character.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onFocus={(e) => e.target.select()}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        placeholder="Character Name"
                    />
                </div>

                <div className={styles.infoGrid}>
                    <div className={styles.infoField}>
                        <label>Class</label>
                        <input value={character.className} onChange={(e) => handleChange('className', e.target.value)} placeholder="Class" />
                    </div>
                    <div className={styles.infoField}>
                        <label>Subclass</label>
                        <input value={character.subclass} onChange={(e) => handleChange('subclass', e.target.value)} placeholder="Subclass" />
                    </div>
                    <div className={styles.infoField}>
                        <label>Race</label>
                        <input value={character.race} onChange={(e) => handleChange('race', e.target.value)} placeholder="Race" />
                    </div>
                    <div className={styles.infoField}>
                        <label>Level</label>
                        <input type="number" value={character.level} onChange={(e) => handleChange('level', parseInt(e.target.value) || 1)} />
                    </div>
                </div>
            </header>

            {/* --- TOP ROW: STATS --- */}
            <div className={styles.topStatsRow}>
                <div className={styles.abilityScoresRow}>
                    {(['str', 'int', 'dex', 'wis', 'con', 'cha'] as Array<keyof AbilityScores>).map(score => {
                        const val = character.abilityScores[score];
                        const mod = getModifier(val);
                        const skills = SKILLS[score];
                        return (
                            <div key={score} className={styles.abilityColumn}>
                                <div className={styles.scoreBox}>
                                    <span className={styles.scoreLabel}>{score.toUpperCase()}</span>
                                    <div className={styles.scoreInputWrapper}>
                                        <input
                                            className={styles.scoreInput}
                                            type="number"
                                            value={val}
                                            onChange={(e) => handleAbilityScoreChange(score, parseInt(e.target.value) || 10)}
                                        />
                                    </div>
                                    <div className={styles.scoreMod}>{formatMod(mod)}</div>
                                </div>
                                {skills.length > 0 && (
                                    <div className={styles.skillsList}>
                                        {skills.map(skill => {
                                            const isProf = character.proficiencies.includes(skill);
                                            // Optional: add proficiency bonus to modifier if proficient
                                            const totalMod = isProf ? mod + character.proficiencyBonus : mod;
                                            return (
                                                <div
                                                    key={skill}
                                                    className={clsx(styles.skillRow, { [styles.skillProficient]: isProf })}
                                                    onClick={() => toggleSkillProficiency(skill)}
                                                >
                                                    <span className={styles.skillMod}>{formatMod(totalMod)}</span>
                                                    <span className={styles.skillName}>{skill}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- SECOND ROW: COMBAT STATS & SENSES --- */}
            <div className={styles.secondaryStatsRow}>
                <div className={styles.combatStats}>
                    <div className={styles.combatBox}>
                        <label>Armor Class</label>
                        <input type="number" value={character.armorClass} onChange={(e) => handleChange('armorClass', parseInt(e.target.value) || 10)} />
                    </div>
                    <div className={styles.combatBox}>
                        <label>Initiative</label>
                        <input type="number" value={character.initiativeBonus} onChange={(e) => handleChange('initiativeBonus', parseInt(e.target.value) || 0)} />
                    </div>
                    <div className={styles.combatBox}>
                        <label>Speed</label>
                        <input type="number" value={character.speed} onChange={(e) => handleChange('speed', parseInt(e.target.value) || 30)} />
                    </div>
                    <div className={styles.combatBox}>
                        <label>Prof. Bonus</label>
                        <input type="number" value={character.proficiencyBonus} onChange={(e) => handleChange('proficiencyBonus', parseInt(e.target.value) || 2)} />
                    </div>
                </div>

                <div className={styles.panelBoxSecondary}>
                    <h3>Passive Senses</h3>
                    <div className={styles.passivesGrid}>
                        <div className={styles.passiveRow}>
                            <span>Percep</span>
                            <input type="number" value={character.passives.perception} onChange={(e) => handlePassiveChange('perception', parseInt(e.target.value) || 10)} />
                        </div>
                        <div className={styles.passiveRow}>
                            <span>Invest</span>
                            <input type="number" value={character.passives.investigation} onChange={(e) => handlePassiveChange('investigation', parseInt(e.target.value) || 10)} />
                        </div>
                        <div className={styles.passiveRow}>
                            <span>Insight</span>
                            <input type="number" value={character.passives.insight} onChange={(e) => handlePassiveChange('insight', parseInt(e.target.value) || 10)} />
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT GRID --- */}
            <div className={styles.mainGrid}>

                {/* ROW 1: ATTACKS & MAGIC */}
                <div className={styles.gridRow}>
                    <div className={styles.panelBox}>
                        <div className={styles.panelHeader}>
                            <h3>Weapons & Attacks</h3>
                            <button className={styles.iconBtn} onClick={addWeapon} title="Add Weapon"><Plus size={16} /></button>
                        </div>
                        <div className={styles.itemList}>
                            {(character.weapons || []).map((wep, index) => (
                                <div key={wep.id} className={styles.itemCard}>
                                    <div className={styles.itemHeader}>
                                        <input
                                            className={styles.itemName}
                                            value={wep.name}
                                            onChange={(e) => updateWeapon(index, 'name', e.target.value)}
                                            placeholder="Weapon Name"
                                        />
                                        <button className={styles.removeBtn} onClick={() => removeWeapon(index)}><Trash2 size={14} /></button>
                                    </div>
                                    <div className={styles.itemDetailsRow}>
                                        <div className={styles.detailField}>
                                            <label>ATK</label>
                                            <input
                                                className={styles.tinyInput}
                                                value={wep.attackBonus}
                                                onChange={(e) => updateWeapon(index, 'attackBonus', e.target.value)}
                                                placeholder="+5"
                                            />
                                        </div>
                                        <div className={styles.detailField}>
                                            <label>DMG</label>
                                            <input
                                                className={styles.mediumInput}
                                                value={wep.damage}
                                                onChange={(e) => updateWeapon(index, 'damage', e.target.value)}
                                                placeholder="1d8+3"
                                            />
                                        </div>
                                        <div className={styles.detailField}>
                                            <label>Type</label>
                                            <input
                                                className={styles.mediumInput}
                                                value={wep.type}
                                                onChange={(e) => updateWeapon(index, 'type', e.target.value)}
                                                placeholder="Slashing"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(character.weapons || []).length === 0 && <p className={styles.emptyText}>No weapons added.</p>}
                        </div>
                    </div>

                    <div className={styles.panelBox}>
                        <div className={styles.panelHeader}>
                            <h3>Spells & Cantrips</h3>
                            <button className={styles.iconBtn} onClick={addSpell} title="Add Spell"><Plus size={16} /></button>
                        </div>
                        <div className={styles.itemList}>
                            {(character.spells || []).map((spell, index) => (
                                <div key={spell.id} className={styles.itemCard}>
                                    <div className={styles.itemHeader}>
                                        <input
                                            className={styles.itemName}
                                            value={spell.name}
                                            onChange={(e) => updateSpell(index, 'name', e.target.value)}
                                            placeholder="Spell Name"
                                        />
                                        <div className={styles.spellLevelDrop}>
                                            <label>Level </label>
                                            <input
                                                type="number"
                                                className={styles.tinyInput}
                                                value={spell.level}
                                                onChange={(e) => updateSpell(index, 'level', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <button className={styles.removeBtn} onClick={() => removeSpell(index)}><Trash2 size={14} /></button>
                                    </div>
                                    <div className={styles.itemDetailsRow}>
                                        <input value={spell.castingTime} onChange={(e) => updateSpell(index, 'castingTime', e.target.value)} placeholder="Time (1 Act)" />
                                        <input value={spell.range} onChange={(e) => updateSpell(index, 'range', e.target.value)} placeholder="Range (60ft)" />
                                        <input value={spell.duration} onChange={(e) => updateSpell(index, 'duration', e.target.value)} placeholder="Dur (Inst)" />
                                    </div>
                                    <textarea
                                        className={styles.itemDesc}
                                        value={spell.description}
                                        onChange={(e) => updateSpell(index, 'description', e.target.value)}
                                        placeholder="Spell Description..."
                                        rows={2}
                                    />
                                </div>
                            ))}
                            {(character.spells || []).length === 0 && <p className={styles.emptyText}>No spells prepared.</p>}
                        </div>
                    </div>
                </div>

                {/* ROW 2: TRAITS & SKILLS */}
                <div className={styles.gridRow}>
                    <div className={styles.panelBox}>
                        <div className={styles.panelHeader}>
                            <h3>Features & Traits</h3>
                            <button className={styles.iconBtn} onClick={addFeat} title="Add Feature"><Plus size={16} /></button>
                        </div>
                        <div className={styles.itemList}>
                            {character.feats.map((feat, index) => (
                                <div key={feat.id} className={styles.itemCard}>
                                    <div className={styles.itemHeader}>
                                        <input
                                            className={styles.itemName}
                                            value={feat.name}
                                            onChange={(e) => updateFeat(index, 'name', e.target.value)}
                                            placeholder="Feature Name"
                                        />
                                        <button className={styles.removeBtn} onClick={() => removeFeat(index)}><Trash2 size={14} /></button>
                                    </div>
                                    <textarea
                                        className={styles.itemDesc}
                                        value={feat.description}
                                        onChange={(e) => updateFeat(index, 'description', e.target.value)}
                                        placeholder="Description..."
                                        rows={2}
                                    />
                                </div>
                            ))}
                            {character.feats.length === 0 && <p className={styles.emptyText}>No features added.</p>}
                        </div>
                    </div>

                    <div className={styles.panelBox}>
                        <ListEditor
                            title="Proficiencies & Languages"
                            items={character.proficiencies}
                            onChange={handleProficienciesChange}
                            placeholder="Add proficiency..."
                        />
                    </div>
                </div>

                {/* ROW 3: EQUIPMENT & CONTEXT */}
                <div className={styles.gridRow}>
                    <div className={styles.panelBox}>
                        <div className={styles.panelHeader}>
                            <h3>Equipment</h3>
                            <div className={styles.headerActions}>
                                <span className={styles.weightTotal}>{totalWeight} lbs</span>
                                <button className={styles.iconBtn} onClick={addInventoryItem} title="Add Item"><Plus size={16} /></button>
                            </div>
                        </div>
                        <div className={styles.itemList}>
                            {character.inventory.map((item, index) => (
                                <div key={item.id} className={styles.itemCard}>
                                    <div className={styles.itemHeader}>
                                        <input
                                            className={styles.itemName}
                                            value={item.name}
                                            onChange={(e) => updateInventoryItem(index, 'name', e.target.value)}
                                            placeholder="Item Name"
                                        />
                                        <button className={styles.removeBtn} onClick={() => removeInventoryItem(index)}><Trash2 size={14} /></button>
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <div className={styles.detailField}>
                                            <label>Qty</label>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateInventoryItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className={styles.detailField}>
                                            <label>Wt (lbs)</label>
                                            <input
                                                type="number"
                                                value={item.weight}
                                                onChange={(e) => updateInventoryItem(index, 'weight', parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                    <input
                                        className={styles.itemNotes}
                                        value={item.notes || ''}
                                        onChange={(e) => updateInventoryItem(index, 'notes', e.target.value)}
                                        placeholder="Notes..."
                                    />
                                </div>
                            ))}
                            {character.inventory.length === 0 && <p className={styles.emptyText}>Inventory is empty.</p>}
                        </div>
                    </div>

                    <div className={styles.panelBox}>
                        <h3>Backstory / Notes</h3>
                        <textarea
                            className={styles.notesArea}
                            value={character.backstory}
                            onChange={(e) => handleChange('backstory', e.target.value)}
                            placeholder="Write your character's tale here..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
