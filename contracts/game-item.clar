;; Game Asset - Dynamic NFTs
;; In-game items (Sword, Shield) with upgradeable stats (Attack, Defense)

(define-constant err-not-owner (err u100))

(define-non-fungible-token game-item uint)
(define-data-var last-id uint u0)

(define-map item-stats
    uint
    {
        name: (string-ascii 20),
        level: uint,
        power: uint
    }
)

(define-public (mint (name (string-ascii 20)))
    (let
        (
            (id (+ (var-get last-id) u1))
        )
        (try! (nft-mint? game-item id tx-sender))
        
        (map-set item-stats id {
            name: name,
            level: u1,
            power: u10
        })
        
        (var-set last-id id)
        (ok id)
    )
)

(define-public (upgrade (id uint))
    (let
        (
            (stats (unwrap! (map-get? item-stats id) (err u404)))
        )
        (asserts! (is-eq (some tx-sender) (nft-get-owner? game-item id)) err-not-owner)
        
        ;; Burn upgrade material/cost (simulated)
        ;; (try! (stx-transfer? u100 tx-sender (as-contract tx-sender)))

        (map-set item-stats id (merge stats {
            level: (+ (get level stats) u1),
            power: (+ (get power stats) u5)
        }))
        (ok true)
    )
)

(define-read-only (get-stats (id uint))
    (map-get? item-stats id)
)
