
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import {
    makeContractCall,
    broadcastTransaction,
    callReadOnlyFunction,
    uintCV,
    standardPrincipalCV,
    boolCV,
    stringAsciiCV,
    AnchorMode,
    PostConditionMode,
    cvToJSON
} from '@stacks/transactions';

export interface GameAssetConfig {
    contractAddress: string;
    contractName: string;
    network: 'mainnet' | 'testnet';
}

export class GameAssetSDK {
    private config: GameAssetConfig;
    private network: StacksMainnet | StacksTestnet;

    constructor(config: GameAssetConfig) {
        this.config = config;
        this.network = config.network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
    }

    /** Mint new game asset (admin only). */
    async mint(recipient: string, senderKey: string): Promise<string> {
        const tx = await makeContractCall({
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName: 'mint',
            functionArgs: [standardPrincipalCV(recipient)],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        });
        const result = await broadcastTransaction(tx, this.network);
        return result.txid;
    }

    /** Burn an asset you own. */
    async burn(id: number, senderKey: string): Promise<string> {
        const tx = await makeContractCall({
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName: 'burn',
            functionArgs: [uintCV(id)],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        });
        const result = await broadcastTransaction(tx, this.network);
        return result.txid;
    }

    /** Transfer asset to another principal. */
    async transfer(id: number, sender: string, recipient: string, senderKey: string): Promise<string> {
        const tx = await makeContractCall({
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName: 'transfer',
            functionArgs: [
                uintCV(id),
                standardPrincipalCV(sender),
                standardPrincipalCV(recipient)
            ],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        });
        const result = await broadcastTransaction(tx, this.network);
        return result.txid;
    }

    /** Admin: Update token URI metadata. */
    async setTokenUri(id: number, uri: string, senderKey: string): Promise<string> {
        const tx = await makeContractCall({
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName: 'set-token-uri',
            functionArgs: [
                uintCV(id),
                stringAsciiCV(uri)
            ],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        });
        const result = await broadcastTransaction(tx, this.network);
        return result.txid;
    }

    /** Admin: Freeze or unfreeze contract. */
    async freezeContract(frozen: boolean, senderKey: string): Promise<string> {
        const tx = await makeContractCall({
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName: 'freeze-contract',
            functionArgs: [boolCV(frozen)],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        });
        const result = await broadcastTransaction(tx, this.network);
        return result.txid;
    }

    /** Get current owner of asset. */
    async getOwner(id: number): Promise<string | null> {
        const result = await callReadOnlyFunction({
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName: 'get-owner',
            functionArgs: [uintCV(id)],
            network: this.network,
            senderAddress: this.config.contractAddress,
        });
        const json = cvToJSON(result);
        return json.value?.value || null;
    }
}
