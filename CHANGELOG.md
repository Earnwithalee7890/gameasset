# CHANGELOG — GameAsset

## [2.0.0] — 2026-02-19

### Added
- **Supply Cap**: `mint-limit` enforces maximum token supply (default `u10000`).
- **Administrative Controls**: `freeze-contract` allows pausing all transfers during emergencies.
- **Burning**: `burn` function allows users to permanently destroy assets.
- **Metadata**: `set-token-uri` and `get-token-uri` for full SIP-009 compatibility.
- **SDK**: TypeScript client with mint, burn, transfer, and admin functions.

### Changed
- **Minting Authorization**: Restricted `mint` function to `CONTRACT-OWNER` only.
- **Transfers**: Disabled transfers when contract is frozen (`err-frozen`).

---

## [1.0.0] — 2026-02-10

### Added
- Basic SIP-009 NFT implementation.
