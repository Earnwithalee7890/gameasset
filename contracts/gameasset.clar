
;; GameAsset v2 — SIP-009 NFT for In-Game Items
;; v2: Added minting cap, metadata updates, and freeze authority

(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-non-fungible-token game-asset uint)

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-MINT-LIMIT (err u101))
(define-constant ERR-FROZEN (err u102))

(define-data-var last-id uint u0)
(define-data-var mint-limit uint u10000)
(define-data-var contract-frozen bool false)
(define-map token-uris uint (string-ascii 256))

;; ================================
;; ADMIN
;; ================================

(define-public (set-mint-limit (limit uint))
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
        (var-set mint-limit limit)
        (ok true)
    )
)

(define-public (freeze-contract (frozen bool))
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
        (var-set contract-frozen frozen)
        (ok true)
    )
)

(define-public (set-token-uri (id uint) (uri (string-ascii 256)))
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
        (map-set token-uris id uri)
        (ok true)
    )
)

;; ================================
;; PUBLIC FUNCTIONS
;; ================================

(define-public (mint (recipient principal))
    (let
        (
            (id (+ (var-get last-id) u1))
        )
        (asserts! (not (var-get contract-frozen)) ERR-FROZEN)
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
        (asserts! (<= id (var-get mint-limit)) ERR-MINT-LIMIT)
        
        (try! (nft-mint? game-asset id recipient))
        (var-set last-id id)
        (ok id)
    )
)

(define-public (burn (id uint))
    (begin
        (asserts! (not (var-get contract-frozen)) ERR-FROZEN)
        (asserts! (is-eq (some tx-sender) (nft-get-owner? game-asset id)) ERR-NOT-OWNER)
        (nft-burn? game-asset id tx-sender)
    )
)

(define-public (transfer (id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (not (var-get contract-frozen)) ERR-FROZEN)
        (asserts! (is-eq tx-sender sender) ERR-NOT-OWNER)
        (nft-transfer? game-asset id sender recipient)
    )
)

;; ================================
;; READ-ONLY
;; ================================

(define-read-only (get-last-token-id)
    (ok (var-get last-id))
)

(define-read-only (get-token-uri (id uint))
    (ok (map-get? token-uris id))
)

(define-read-only (get-owner (id uint))
    (ok (nft-get-owner? game-asset id))
)
