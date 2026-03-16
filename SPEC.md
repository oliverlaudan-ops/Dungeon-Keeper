# Dungeon Keeper - Incremental Game Specification

## Overview

**Project Name:** Dungeon Keeper  
**Type:** Text-Based Incremental / Idle Game  
**Platform:** Browser (HTML/CSS/JS)  
**Concept:** You are a Dungeon Keeper building the ultimate dungeon to defeat invading heroes

## Core Loop

1. **Attract Heroes** - Heroes are drawn to your dungeon by treasure
2. **Defeat Heroes** - Monsters and traps kill heroes, you gain gold/souls
3. **Upgrade Dungeon** - Spend gold to build more rooms, monsters, traps
4. **Repeat** - Stronger dungeon attracts stronger (more rewarding) heroes

## Resources

| Resource | Icon | Description |
|----------|------|-------------|
| Gold | 💰 | Main currency, earned from defeated heroes |
| Souls | 💀 | Premium currency, rare drops, used for special upgrades |
| Food | 🍖 | Required to feed monsters, consumed over time |
| Imps | 👹 | Workers that build and maintain your dungeon |

## Buildings (Rooms)

### 🐉 Monster Rooms
| Room | Cost | Upkeep | Effect |
|------|------|--------|--------|
| Kobold Den | 50g | 1🍖/tick | Spawns 1 Kobold (weak) |
| Orc Barracks | 200g | 5🍖/tick | Spawns 2 Orcs (medium) |
| Dragon Lair | 1000g | 20🍖/tick | Spawns 1 Dragon (boss) |
| Vampire Crypt | 500g | 10🍖/tick | Spawns 2 Vampires (strong) |

### ⚙️ Trap Rooms
| Room | Cost | Effect |
|------|------|--------|
| Spike Trap | 30g | 5 damage per hero |
| Poison Gas | 100g | 15 damage + 3 ticks DOT |
| Fire Trap | 250g | 40 damage (area) |
| Teleport Loop | 500g | Sends hero back to entrance |

### 🚪 Defensive Rooms
| Room | Cost | Effect |
|------|------|--------|
| Iron Door | 25g | +5 seconds to clear |
| Locked Door | 75g | Requires key to open |
| Gatehouse | 200g | Controls hero flow |

### 💰 Income Rooms
| Room | Cost | Effect |
|------|------|--------|
| Treasure Room | 40g | +10% gold from heroes |
| Offering Pit | 150g | +1 soul per 10 heroes |
| Gold Mine | 500g | +5 gold per tick (slow) |

### ⛏️ Utility Rooms
| Room | Cost | Effect |
|------|------|--------|
| Larder | 30g | +50 food storage |
| Training Pit | 100g | +10% monster damage |
| Prison | 300g | Captures heroes (enslave) |

## Monsters

| Monster | Attack | Health | Cost | Food |
|---------|--------|--------|------|------|
| Kobold | 5 | 10 | 25g | 1 |
| Orc | 15 | 40 | 100g | 3 |
| Troll | 30 | 80 | 250g | 5 |
| Vampire | 50 | 60 | 400g | 8 |
| Dragon | 100 | 200 | 1000g | 20 |

## Heroes (Enemies)

Heroes scale with your dungeon level. Higher level = more HP/damage but more gold reward.

| Hero Type | Appears | Attack | HP | Gold Drop |
|-----------|---------|--------|-----|-----------|
| Beggar | Level 1 | 2 | 20 | 5g |
| Squire | Level 3 | 5 | 50 | 15g |
| Knight | Level 5 | 15 | 150 | 50g |
| Paladin | Level 8 | 30 | 300 | 150g |
| Dragon Slayer | Level 10 | 50 | 500 | 500g |

## Hero Wave System

- Heroes arrive in waves (every 60 seconds base)
- Wave size = floor(dungeon_level / 2) + 1
- Hero level = random(1 to dungeon_level)
- After wave defeat: 10 second break, then next wave

## Upgrades

### Dungeon Upgrades
| Upgrade | Cost | Effect |
|---------|------|--------|
| Bigger Entrance | 200g | Attracts 50% more heroes |
| Dark Aura | 500g | Heroes have 10% less accuracy |
| Unholy Ground | 1000g | Monsters deal +20% damage |

### Monster Upgrades
| Upgrade | Cost | Effect |
|---------|------|--------|
| Sharp Teeth | 100g | +25% monster damage |
| Iron Scales | 150g | +25% monster health |
| Pack Tactics | 300g | +1 attack per adjacent monster |

## Game Stats

- **Total Gold Earned**
- **Heroes Defeated**
- **Heroes Escaped**
- **Souls Collected**
- **Current Dungeon Level**
- **Longest Wave Survived**

## UI Layout

```
┌─────────────────────────────────────────────┐
│ 🏰 DUNGEON KEEPER          Level: 5         │
├─────────────────────────────────────────────┤
│ 💰 Gold: 1,250    💀 Souls: 12    🍖 Food: 85│
│ 👹 Imps: 3/5                                    │
├─────────────────────────────────────────────┤
│ 📊 STATS                                        │
│ Heroes Defeated: 147  │  Escaped: 23         │
│ Gold/sec: 15.2        │  Next Wave: 45s      │
├─────────────────────────────────────────────┤
│ ⚔️ WAVE IN PROGRESS                           │
│ [████████░░] 5/8 heroes remaining           │
├─────────────────────────────────────────────┤
│ 🏗️ BUILD                          [IMP: idle] │
│ ┌─────────────────────────────────────────┐  │
│ │ 🐉 Monster Rooms                        │  │
│ │ [Kobold Den] [Orc Barracks] [Dragon]   │  │
│ │ ⚙️ Traps                                │  │
│ │ [Spike] [Poison] [Fire] [Teleport]     │  │
│ │ 🚪 Doors                                │  │
│ │ [Iron Door] [Locked] [Gatehouse]       │  │
│ │ 💰 Income                               │  │
│ │ [Treasure] [Offering] [Gold Mine]      │  │
│ └─────────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│ 📜 LOG                                          │
│ > A Beggar entered your dungeon               │
│ > Kobold dealt 5 damage to Beggar             │
│ > Beggar defeated! +5 gold                    │
└─────────────────────────────────────────────┘
```

## Color Palette

- **Background:** #0a0a0f (near black)
- **Primary:** #ff6b35 (orange - dungeon fire)
- **Secondary:** #7b2cbf (purple - dark magic)
- **Success:** #2ecc71 (green - gold)
- **Danger:** #e74c3c (red - damage)
- **Text:** #ecf0f1 (light gray)
- **Muted:** #7f8c8d (dark gray)

## Typography

- **Headings:** Cinzel (fantasy serif)
- **Body:** Lato (clean readable)
- **Numbers:** Fira Code (monospace for stats)

## Technical Implementation

- Single HTML file with embedded CSS/JS
- Auto-save to localStorage every 30 seconds
- Game loop runs at 1 tick/second for resource generation
- Wave system runs independently
- Responsive design (works on mobile)

## MVP Features (v0.1)

1. ✅ Gold resource with display
2. ✅ Basic rooms (Kobold Den, Spike Trap, Treasure Room)
3. ✅ Hero spawning and combat
4. ✅ Wave system
5. ✅ Basic upgrade system
6. ✅ Game log
7. ✅ Auto-save

## Future Features (v0.2+)

- Soul currency
- More monster types
- Prestige system
- Achievements
- Offline progress calculation