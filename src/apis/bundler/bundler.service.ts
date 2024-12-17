import env from "@config/index";
import { Bundler, createBundler } from "@biconomy/account";

class BundlerService {
    private _bundler!: Bundler;

    /**
     * Constructs the bundler URL for a given chain ID.
     * @param {number} chainId - The chain ID of the target EVM chain.
     * @returns {Promise<void>}
     * @private
     */
    private async createBundler(chainId: number) {
        try {
            const bundlerUrl = `${env.bundlerPrexUrl}/${chainId}/${env.biconomyApiKey}`;

            this._bundler = await createBundler({
                bundlerUrl,
            });
        } catch (err: any) {
            console.error(`Failed to create bundler service: ${err.stack}`);
        }
    }

    /**
     * Creates a bundler service for a given chain ID.
     * @param {number} chainId - The chain ID of the target EVM chain.
     * @returns {Promise<BundlerService>}
     */
    public static async create(chainId: number) {
        const instance = new BundlerService();

        await instance.createBundler(chainId);

        return instance;
    }

    public get bundler(): Bundler {
        return this._bundler;
    }
}

export default BundlerService;
