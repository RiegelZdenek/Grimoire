import React from 'react';
import { BookOpen, Swords } from 'lucide-react';
import styles from './Rules.module.css';
import { RuleSection } from './components/RuleSection/RuleSection';

export const Rules: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Quick Rules Reference</h1>
                <p className={styles.subtitle}>A fast and handy guide to D&D 5E mechanics.</p>
            </div>

            <div className={styles.scrollArea}>
                <div className={styles.sections}>
                    <RuleSection title="Vocabulary & Key Terms" icon={BookOpen}>
                        <dl className={styles.glossary}>
                            <div className={styles.termBlock}>
                                <dt>AC (Armor Class)</dt>
                                <dd>How hard it is to land a clean hit on a target. Attacks must meet or exceed this number to deal damage.</dd>
                            </div>
                            <div className={styles.termBlock}>
                                <dt>DC (Difficulty Class)</dt>
                                <dd>The target number a player must meet or exceed when making an Ability Check or Saving Throw.</dd>
                            </div>
                            <div className={styles.termBlock}>
                                <dt>HP (Hit Points)</dt>
                                <dd>A creature's life force. When it reaches 0, they fall unconscious or die.</dd>
                            </div>
                            <div className={styles.termBlock}>
                                <dt>Advantage / Disadvantage</dt>
                                <dd>Roll <strong>two d20s</strong> instead of one. With Advantage, take the <strong>higher</strong> result. With Disadvantage, take the <strong>lower</strong> result.</dd>
                            </div>
                            <div className={styles.termBlock}>
                                <dt>Saving Throw</dt>
                                <dd>A sudden, reactive roll (d20 + modifier) to resist a spell, trap, poison, or hazard.</dd>
                            </div>
                            <div className={styles.termBlock}>
                                <dt>Ability Check</dt>
                                <dd>An active roll (d20 + modifier) to accomplish a challenging task using raw talent or a specific skill (e.g., Athletics, Stealth).</dd>
                            </div>
                        </dl>
                    </RuleSection>

                    <RuleSection title="Combat Overview" icon={Swords}>
                        <div className={styles.combatGuide}>
                            <h3>1. Initiative</h3>
                            <p>At the start of combat, everyone rolls Initiative (<strong>1d20 + Dexterity modifier</strong>). The combat order proceeds from highest to lowest.</p>

                            <h3>2. Anatomy of a Turn</h3>
                            <p>On your turn, you can move a distance up to your speed, and take the following actions:</p>
                            <ul className={styles.actionList}>
                                <li><strong>Action:</strong> The main thing you do. E.g., Attack, Cast a Spell, Dash, Dodge, Help, Hide.</li>
                                <li><strong>Bonus Action:</strong> A quick secondary action. You can only take one if a special ability, spell, or offhand weapon allows it.</li>
                                <li><strong>Reaction:</strong> An instant response to a specific trigger, which can happen <em>outside</em> your turn. E.g., Opportunity Attack (when someone leaves your reach). You get one per round.</li>
                            </ul>

                            <h3>3. Resolving an Attack</h3>
                            <div className={styles.exampleBox}>
                                <p><strong>Step 1: The Attack Roll</strong></p>
                                <p>Roll <strong>1d20 + Attack Modifier</strong> (usually Str/Dex + Proficiency). Compare to the target's <strong>AC</strong>. If it matches or exceeds the AC, it hits! A natural 20 is a Critical Hit.</p>

                                <p><strong>Step 2: The Damage Roll</strong></p>
                                <p>Roll the weapon's damage dice and add the relevant modifier (Str/Dex). Do <em>not</em> add Proficiency to damage. On a Critical Hit, roll all the damage dice twice.</p>

                                <div className={styles.exampleScenario}>
                                    <strong>Example:</strong> A Fighter with a Longsword (+5 to hit, 1d8+3 damage) attacks a Goblin (AC 15).
                                    They roll a 12 on the d20. 12 + 5 = 17. Because 17 is greater than 15, it hits!
                                    They then roll 1d8, getting a 4. They deal 4 + 3 = 7 slashing damage to the Goblin.
                                </div>
                            </div>

                            <h3>4. Saving Throws & Spell Save DCs</h3>
                            <p>Instead of the attacker rolling to hit, some spells and effects force the <em>target</em> to roll to defend themselves. This is called a <strong>Saving Throw</strong>.</p>
                            <p>The target rolls a <strong>1d20 + the required Ability Modifier + Proficiency (if applicable)</strong> and tries to meet or exceed the attacker's <strong>Spell Save DC</strong>.</p>

                            <div className={styles.exampleBox} style={{ marginTop: '16px', marginBottom: '16px' }}>
                                <p><strong>Calculating Spell Save DC</strong></p>
                                <p style={{ fontSize: '1.1rem', textAlign: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                                    <strong>8 + Proficiency Bonus + Spellcasting Ability Modifier + Special Modifiers</strong>
                                </p>
                                <ul className={styles.actionList} style={{ marginTop: '12px', marginBottom: '12px' }}>
                                    <li><strong>Base (8):</strong> A fixed starting value for all spellcasters.</li>
                                    <li><strong>Proficiency Bonus:</strong> Scales as your character levels up (+2 at lvl 1, +3 at lvl 5, etc.).</li>
                                    <li><strong>Spellcasting Ability Modifier:</strong> Depends on your class:
                                        <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                                            <li><strong>Intelligence:</strong> Wizard, Artificer</li>
                                            <li><strong>Wisdom:</strong> Cleric, Druid, Ranger</li>
                                            <li><strong>Charisma:</strong> Bard, Paladin, Sorcerer, Warlock</li>
                                        </ul>
                                    </li>
                                    <li><strong>Special Modifiers:</strong> Bonuses from magic items (like a <em>Rod of the Pact Keeper</em>).</li>
                                </ul>
                            </div>

                            <p>When the target rolls their saving throw:</p>
                            <ul className={styles.actionList}>
                                <li><strong>Success:</strong> The target usually takes half damage and avoids extra effects.</li>
                                <li><strong>Failure:</strong> The target takes full damage and suffers any additional effects (like being poisoned or restrained).</li>
                            </ul>
                            <div className={styles.exampleBox}>
                                <div className={styles.exampleScenario} style={{ marginTop: 0 }}>
                                    <strong>Example:</strong> A Level 5 Wizard (+3 Prof, +4 Int) casts <em>Fireball</em>. Their Save DC is 8 + 3 + 4 = <strong>15</strong>.
                                    A Goblin rolls a Dexterity Saving Throw and gets a 12. Because 12 is lower than 15, the Goblin fails the save and takes the full 8d6 fire damage!
                                </div>
                            </div>
                        </div>
                    </RuleSection>
                </div>
            </div>
        </div>
    );
};
