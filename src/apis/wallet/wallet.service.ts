import logger from "@shared/lib/logger";
import { ethers, Wallet } from "ethers";

class WalletService {
    private _signer!: Wallet;

    /**
     * Creates a client wallet for a given private key and chain ID.
     * @param {string} privateKey - The private key of the wallet.
     * @param {number} chainId - The chain ID of the target EVM chain.
     * @returns {Promise<void>}
     * @private
     */
    private async createSignerWallet(privateKey: string, rpcUrl: string) {
        try {
            const _privateKey = privateKey.startsWith("0x")
                ? privateKey
                : `0x${privateKey}`;
            const provider = new ethers.JsonRpcProvider(rpcUrl);

            this._signer = new ethers.Wallet(_privateKey, provider);
        } catch (err: any) {
            logger.error(`Error creating signer wallet: ${err.stack}`);
        }
    }

    /**
     * Creates a wallet service for a given private key and chain ID.
     * @param {string} privateKey - The private key of the wallet.
     * @param {string} rpcUrl - The rpc url for the wallet.
     * @returns {Promise<WalletService>}
     */
    public static async create(privateKey: string, rpcUrl: string) {
        const instance = new WalletService();

        await instance.createSignerWallet(privateKey, rpcUrl);

        return instance;
    }

    /**
     * @returns {Wallet}
     */
    public get signer() {
        return this._signer;
    }
}

export default WalletService;
