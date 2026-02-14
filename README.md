# Game Asset ⚔️

**Game Asset** is a dynamic NFT protocol on Stacks for tokenizing in-game items. Unlike static JPEGs, these assets serve as mutable game state, allowing players to upgrade their gear on-chain.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Gaming](https://img.shields.io/badge/industry-Web3%20Gaming-red)

## Features

- **Dynamic Metadata**: Items have mutable stats (Level, Power).
- **On-Chain Upgrades**: Logic to modify asset properties based on gameplay.
- **True Ownership**: Trade leveled-up items on secondary markets.

## Contract Interface

```clarity
;; Mint a new Sword
(mint "Iron Sword")

;; Upgrade Item #1 (Level +1, Power +5)
(upgrade u1)

;; Check Stats
(get-stats u1)
;; Result: { name: "Iron Sword", level: 2, power: 15 }
```

## License
MIT
