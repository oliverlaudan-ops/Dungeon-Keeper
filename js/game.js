        // Game State
        const game = {
            resources: {
                gold: 50,
                souls: 0,
                food: 50,
                maxFood: 50,
                imps: 1,
                maxImps: 3
            },
            stats: {
                heroesDefeated: 0,
                heroesEscaped: 0,
                totalGold: 0,
                dungeonLevel: 1
            },
            buildings: {},
            upgrades: {},
            wave: {
                active: false,
                heroes: [],
                timer: 60,
                waveNumber: 0
            },
            tickCount: 0
        };

        // Building Definitions
        const BUILDINGS = {
            monsters: [
                { id: 'kobold_den', name: 'Kobold Den', icon: '🐺', cost: 50, food: 1, effect: 'Spawns 1 Kobold', damage: 5, health: 10 },
                { id: 'orc_barracks', name: 'Orc Barracks', icon: '👹', cost: 200, food: 5, effect: 'Spawns 2 Orcs', damage: 15, health: 40 },
                { id: 'troll_cave', name: 'Troll Cave', icon: '🧌', cost: 500, food: 8, effect: 'Spawns 1 Troll', damage: 30, health: 80 },
                { id: 'vampire_crypt', name: 'Vampire Crypt', icon: '🧛', cost: 1000, food: 12, effect: 'Spawns 2 Vampires', damage: 50, health: 60 },
                { id: 'dragon_lair', name: 'Dragon Lair', icon: '🐉', cost: 2500, food: 25, effect: 'Spawns 1 Dragon', damage: 100, health: 200 }
            ],
            traps: [
                { id: 'spike_trap', name: 'Spike Trap', icon: '🔪', cost: 30, effect: '5 damage per hero', damage: 5 },
                { id: 'poison_gas', name: 'Poison Gas', icon: '☠️', cost: 100, effect: '15 damage + DOT', damage: 15 },
                { id: 'fire_trap', name: 'Fire Trap', icon: '🔥', cost: 250, effect: '40 area damage', damage: 40 },
                { id: 'teleport_loop', name: 'Teleport Loop', icon: '🌀', cost: 500, effect: 'Sends hero to start', special: 'teleport' }
            ],
            income: [
                { id: 'treasure_room', name: 'Treasure Room', icon: '💰', cost: 40, effect: '+10% gold' },
                { id: 'gold_mine', name: 'Gold Mine', icon: '⛏️', cost: 500, effect: '+5 gold/tick' },
                { id: 'kitchen', name: 'Kitchen', icon: '🍳', cost: 100, effect: '+2 food/tick' },
                { id: 'offering_pit', name: 'Offering Pit', icon: '🕯️', cost: 150, effect: '+1 soul/10 heroes' }
            ],
            utilities: [
                { id: 'larder', name: 'Larder', icon: '🍖', cost: 30, effect: '+50 food storage' },
                { id: 'training_pit', name: 'Training Pit', icon: '⚔️', cost: 100, effect: '+10% monster damage' },
                { id: 'guard_room', name: 'Guard Room', icon: '🛡️', cost: 200, effect: '+1 imp capacity' }
            ]
        };

        // Upgrade Definitions
        const UPGRADES = [
            { id: 'bigger_entrance', name: 'Bigger Entrance', desc: 'Attracts 50% more heroes', cost: 200 },
            { id: 'dark_aura', name: 'Dark Aura', desc: 'Heroes have 10% less accuracy', cost: 500 },
            { id: 'unholy_ground', name: 'Unholy Ground', desc: 'Monsters deal +20% damage', cost: 1000 }
        ];

        // Hero Definitions
        const HEROES = [
            { name: 'Beggar', attack: 2, health: 20, gold: 5 },
            { name: 'Squire', attack: 5, health: 50, gold: 15 },
            { name: 'Knight', attack: 15, health: 150, gold: 50 },
            { name: 'Paladin', attack: 30, health: 300, gold: 150 },
            { name: 'Dragon Slayer', attack: 50, health: 500, gold: 500 }
        ];

        // Initialize Game
        function init() {
            loadGame();
            setupTabs();
            renderBuildings();
            renderUpgrades();
            startGameLoop();
            setInterval(saveGame, 30000); // Auto-save every 30 seconds
            log('🏰 Welcome, Dungeon Keeper! Build your dungeon to defeat heroes!');
        }

        // Tab Navigation
        function setupTabs() {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    renderBuildings(btn.dataset.tab);
                });
            });
        }

        // Render Buildings
        function renderBuildings(tab = 'monsters') {
            const grid = document.getElementById('building-grid');
            grid.innerHTML = '';

            const buildings = BUILDINGS[tab] || [];
            buildings.forEach(b => {
                const count = game.buildings[b.id] || 0;
                const card = document.createElement('div');
                card.className = `building-card ${game.resources.gold < b.cost ? 'disabled' : ''}`;
                card.innerHTML = `
                    <div class="icon">${b.icon}</div>
                    <div class="name">${b.name}</div>
                    <div class="cost">💰 ${b.cost}</div>
                    <div class="effect">${b.effect}</div>
                    <div style="margin-top: 4px; color: var(--accent-primary);">Owned: ${count}</div>
                `;
                card.addEventListener('click', () => build(b));
                grid.appendChild(card);
            });
        }

        // Build Function
        function build(building) {
            if (game.resources.gold >= building.cost) {
                game.resources.gold -= building.cost;
                game.buildings[building.id] = (game.buildings[building.id] || 0) + 1;

                // Handle special buildings
                if (building.id === 'larder') {
                    game.resources.maxFood += 50;
                } else if (building.id === 'guard_room') {
                    game.resources.maxImps += 1;
                }

                updateUI();
                renderBuildings(document.querySelector('.tab-btn.active').dataset.tab);
                log(`🏗️ Built ${building.name}`);
            }
        }

        // Render Upgrades
        function renderUpgrades() {
            const list = document.getElementById('upgrades-list');
            list.innerHTML = '';

            UPGRADES.forEach(u => {
                const bought = game.upgrades[u.id] || false;
                if (!bought) {
                    const card = document.createElement('div');
                    card.className = 'upgrade-card';
                    card.innerHTML = `
                        <div class="upgrade-info">
                            <div class="name">${u.name}</div>
                            <div class="desc">${u.desc}</div>
                        </div>
                        <button class="upgrade-btn" onclick="buyUpgrade('${u.id}')" ${game.resources.gold < u.cost ? 'disabled' : ''}>
                            💰 ${u.cost}
                        </button>
                    `;
                    list.appendChild(card);
                }
            });
        }

        // Buy Upgrade
        function buyUpgrade(id) {
            const upgrade = UPGRADES.find(u => u.id === id);
            if (upgrade && game.resources.gold >= upgrade.cost && !game.upgrades[id]) {
                game.resources.gold -= upgrade.cost;
                game.upgrades[id] = true;
                updateUI();
                renderUpgrades();
                log(`⚡ Upgraded: ${upgrade.name}`);
            }
        }

        // Wave System
        function startWave() {
            game.wave.active = true;
            game.wave.waveNumber++;
            game.wave.heroes = [];

            // Calculate hero count based on dungeon level
            const heroCount = Math.floor(game.stats.dungeonLevel / 2) + 1;
            const level = Math.min(game.stats.dungeonLevel, HEROES.length);

            for (let i = 0; i < heroCount; i++) {
                const heroTemplate = HEROES[Math.floor(Math.random() * level)];
                game.wave.heroes.push({
                    ...heroTemplate,
                    maxHealth: heroTemplate.health,
                    currentHealth: heroTemplate.health,
                    damageDealt: 0
                });
            }

            document.getElementById('wave-status-text').innerHTML = '⚔️ <strong>WAVE IN PROGRESS</strong>';
            document.getElementById('wave-progress').style.display = 'block';
            log(`⚔️ Wave ${game.wave.waveNumber} started! ${heroCount} heroes approaching!`);
        }

        // Process Wave
        function processWave() {
            if (!game.wave.active) return;

            const heroes = game.wave.heroes;
            const aliveHeroes = heroes.filter(h => h.currentHealth > 0);

            // Update progress bar
            const totalHeroes = heroes.length;
            const remaining = aliveHeroes.length;
            const progress = ((totalHeroes - remaining) / totalHeroes) * 100;
            document.getElementById('wave-progress-bar').style.width = `${progress}%`;
            document.getElementById('wave-progress-text').textContent = `${remaining}/${totalHeroes} heroes`;

            // Monster attacks
            let totalDamage = 0;
            const monsterBuildings = BUILDINGS.monsters.filter(b => game.buildings[b.id] > 0);
            monsterBuildings.forEach(b => {
                const count = game.buildings[b.id] || 0;
                const damage = b.damage * count;
                totalDamage += damage;
            });

            // Trap damage
            const trapBuildings = BUILDINGS.traps.filter(b => game.buildings[b.id] > 0);
            trapBuildings.forEach(b => {
                const count = game.buildings[b.id] || 0;
                totalDamage += (b.damage || 0) * count;
            });

            // Apply damage to random hero
            if (aliveHeroes.length > 0 && totalDamage > 0) {
                const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
                const actualDamage = Math.max(1, totalDamage);
                target.currentHealth -= actualDamage;
                target.damageDealt += actualDamage;

                if (target.currentHealth <= 0) {
                    // Hero defeated
                    const goldReward = Math.floor(target.gold * (1 + (game.buildings['treasure_room'] || 0) * 0.1));
                    game.resources.gold += goldReward;
                    game.stats.heroesDefeated++;
                    game.stats.totalGold += goldReward;
                    log(`💀 ${target.name} defeated! +${goldReward} gold`, 'gold');
                }
            }

            // Check if wave is over
            const remainingHeroes = heroes.filter(h => h.currentHealth > 0);
            if (remainingHeroes.length === 0) {
                endWave();
            }
        }

        // End Wave
        function endWave() {
            game.wave.active = false;
            game.wave.timer = 60;
            game.stats.dungeonLevel = Math.floor(game.stats.heroesDefeated / 10) + 1;
            
            // Food reward per wave
            game.resources.food += 10 + (game.wave.waveNumber * 2);

            document.getElementById('wave-status-text').textContent = '☀️ Peaceful - Heroes approaching...';
            document.getElementById('wave-progress').style.display = 'none';
            log(`✅ Wave ${game.wave.waveNumber} complete! +${10 + (game.wave.waveNumber * 2)} Food`, 'wave');
        }

        // Game Loop
        function startGameLoop() {
            setInterval(() => {
                game.tickCount++;

                // Resource generation from buildings
                if (game.buildings['gold_mine']) {
                    game.resources.gold += game.buildings['gold_mine'] * 5;
                }
                if (game.buildings['kitchen']) {
                    game.resources.food += game.buildings['kitchen'] * 2;
                }

                // Food consumption
                let foodCost = 0;
                BUILDINGS.monsters.forEach(b => {
                    const count = game.buildings[b.id] || 0;
                    foodCost += (b.food || 0) * count;
                });

                if (game.resources.food >= foodCost) {
                    game.resources.food -= foodCost;
                } else {
                    game.resources.food = 0;
                    // Monsters might die or be less effective - for now just log
                    log('🍖 Not enough food! Monsters are hungry!', 'damage');
                }

                // Wave timer
                if (!game.wave.active) {
                    game.wave.timer--;
                    if (game.wave.timer <= 0) {
                        startWave();
                    }
                } else {
                    processWave();
                }

                // Update display
                updateUI();
            }, 1000);
        }

        // Update UI
        function updateUI() {
            document.getElementById('gold').textContent = Math.floor(game.resources.gold);
            document.getElementById('souls').textContent = game.resources.souls || 0;
            document.getElementById('food').textContent = Math.floor(game.resources.food);
            document.querySelector('#food + span').textContent = `/ ${game.resources.maxFood}`;
            document.getElementById('imps').textContent = game.resources.imps;
            document.querySelector('#imps + span').textContent = `/ ${game.resources.maxImps}`;

            document.getElementById('heroes-defeated').textContent = game.stats.heroesDefeated;
            document.getElementById('heroes-escaped').textContent = game.stats.heroesEscaped;
            document.getElementById('gold-per-sec').textContent = (game.buildings['gold_mine'] || 0) * 5;
            document.getElementById('next-wave').textContent = game.wave.active ? '⚔️' : `${game.wave.timer}s`;
            document.getElementById('dungeon-level').textContent = `Level ${game.stats.dungeonLevel}`;

            // Update building cards availability
            document.querySelectorAll('.building-card').forEach(card => {
                const cost = parseInt(card.querySelector('.cost').textContent.replace('💰 ', ''));
                card.classList.toggle('disabled', game.resources.gold < cost);
            });
        }

        // Log Function
        function log(message, type = '') {
            const logEl = document.getElementById('log');
            const entry = document.createElement('div');
            entry.className = `log-entry ${type}`;
            entry.textContent = message;
            logEl.insertBefore(entry, logEl.firstChild);

            // Keep only last 50 entries
            while (logEl.children.length > 50) {
                logEl.removeChild(logEl.lastChild);
            }
        }

        // Save/Load
        function saveGame() {
            localStorage.setItem('dungeonKeeper', JSON.stringify(game));
        }

        function loadGame() {
            const saved = localStorage.getItem('dungeonKeeper');
            if (saved) {
                const data = JSON.parse(saved);
                Object.assign(game, data);
                log('💾 Game loaded!');
            }
        }

        // Start
        init();
