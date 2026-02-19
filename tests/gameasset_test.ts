
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

Clarinet.test({
    name: "mint: admin can mint tokens up to limit",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('gameasset', 'mint', [types.principal(wallet1.address)], deployer.address)
        ]);

        block.receipts[0].result.expectOk().expectUint(1);
    }
});

Clarinet.test({
    name: "mint: non-admin cannot mint",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get('wallet_1')!;

        let block = chain.mineBlock([
            Tx.contractCall('gameasset', 'mint', [types.principal(wallet1.address)], wallet1.address)
        ]);

        block.receipts[0].result.expectErr().expectUint(100); // ERR-NOT-OWNER
    }
});

Clarinet.test({
    name: "freeze-contract: admin can freeze transfers",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;
        const wallet2 = accounts.get('wallet_2')!;

        // Mint first
        chain.mineBlock([
            Tx.contractCall('gameasset', 'mint', [types.principal(wallet1.address)], deployer.address)
        ]);

        // Freeze
        chain.mineBlock([
            Tx.contractCall('gameasset', 'freeze-contract', [types.bool(true)], deployer.address)
        ]);

        // Try transfer
        let block = chain.mineBlock([
            Tx.contractCall('gameasset', 'transfer', [
                types.uint(1),
                types.principal(wallet1.address),
                types.principal(wallet2.address)
            ], wallet1.address)
        ]);

        block.receipts[0].result.expectErr().expectUint(102); // ERR-FROZEN
    }
});

Clarinet.test({
    name: "burn: owner can burn token",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const wallet1 = accounts.get('wallet_1')!;

        chain.mineBlock([
            Tx.contractCall('gameasset', 'mint', [types.principal(wallet1.address)], deployer.address)
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('gameasset', 'burn', [types.uint(1)], wallet1.address)
        ]);

        block.receipts[0].result.expectOk();
    }
});
