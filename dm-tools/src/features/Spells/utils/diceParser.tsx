const damageColors: Record<string, { color: string, bg: string }> = {
    acid: { color: '#32cd32', bg: 'rgba(50, 205, 50, 0.15)' },
    bludgeoning: { color: '#a9a9a9', bg: 'rgba(169, 169, 169, 0.15)' },
    cold: { color: '#00ffff', bg: 'rgba(0, 255, 255, 0.15)' },
    fire: { color: '#ff4500', bg: 'rgba(255, 69, 0, 0.15)' },
    force: { color: '#8b0000', bg: '#ffcccc' }, // Light red
    lightning: { color: '#00008b', bg: '#cce0ff' }, // Light blue
    nature: { color: '#006400', bg: '#ccffcc' }, // Light green
    necrotic: { color: '#4b0082', bg: '#e6ccff' }, // Light purple
    piercing: { color: '#a9a9a9', bg: 'rgba(169, 169, 169, 0.15)' },
    poison: { color: '#9acd32', bg: 'rgba(154, 205, 50, 0.15)' },
    psychic: { color: '#ff00ff', bg: 'rgba(255, 0, 255, 0.15)' },
    radiant: { color: '#ffd700', bg: 'rgba(255, 215, 0, 0.15)' },
    slashing: { color: '#a9a9a9', bg: 'rgba(169, 169, 169, 0.15)' },
    thunder: { color: '#6a5acd', bg: 'rgba(106, 90, 205, 0.15)' },
    default: { color: '#87ceeb', bg: 'rgba(135, 206, 235, 0.15)' }
};

const DICE_REGEX = /\b(\d+d\d+)(?:\s+(acid|bludgeoning|cold|fire|force|lightning|nature|necrotic|piercing|poison|psychic|radiant|slashing|thunder))?\b/i;
const TOKENIZER_REGEX = /(\*\*.*?\*\*|\b\d+d\d+(?:\s+(?:acid|bludgeoning|cold|fire|force|lightning|nature|necrotic|piercing|poison|psychic|radiant|slashing|thunder))?\b)/gi;

export const getDamageColor = (type?: string | null): { color: string, bg: string } => {
    if (!type) return damageColors.default;
    const lowerType = type.toLowerCase();
    return damageColors[lowerType] || damageColors.default;
};

export interface ExtractedRoll {
    raw: string;
    dice: string;
    type: string | null;
    color: string;
    bg: string;
}

export const extractDamageRolls = (text: string): ExtractedRoll[] => {
    if (!text) return [];
    const rolls: ExtractedRoll[] = [];
    const regex = new RegExp(DICE_REGEX, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
        const theme = getDamageColor(match[2]);
        rolls.push({
            raw: match[0],
            dice: match[1],
            type: match[2] || null,
            color: theme.color,
            bg: theme.bg
        });
    }
    // Deduplicate rolls for the card display
    const uniqueRolls = rolls.filter((v, i, a) => a.findIndex(t => (t.raw === v.raw)) === i);
    return uniqueRolls;
};

export const formatTextWithDiceAndBold = (text: string, styles: { boldText?: string, diceRoll?: string }) => {
    if (!text) return null;

    const parts = text.split(TOKENIZER_REGEX);
    return parts.map((part, i) => {
        if (!part) return null;

        // Handle Bold
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className={styles.boldText}>{part.slice(2, -2)}</strong>;
        }

        // Handle Dice
        const diceMatch = part.match(DICE_REGEX);
        if (diceMatch && diceMatch[0] === part) {
            const damageType = diceMatch[2] || null;
            const theme = getDamageColor(damageType);
            return (
                <span
                    key={i}
                    className={styles.diceRoll}
                    style={{ color: theme.color, backgroundColor: theme.bg, fontWeight: 'bold' }}
                    title={damageType ? `${damageType} damage` : 'Damage roll'}
                >
                    {part}
                </span>
            );
        }

        // Normal text
        return part;
    });
};
