import env from "@config/index";

import { Wallet } from "ethers";
import {
    BiconomySmartAccountV2,
    BiconomySmartAccountV2Config,
    Bundler,
    createSmartAccountClient,
    IPaymaster,
} from "@biconomy/account";
import logger from "@shared/lib/logger";
import BundlerService from "../bundler/bundler.service";
import WalletService from "../wallet/wallet.service";
import PaymasterService from "../paymaster/paymaster.service";

/**
 * A service class to manage smart accounts using Biconomy.
 */
class SmartAccountService {
    private _smartAccount!: BiconomySmartAccountV2;
    private _signer!: Wallet;
    private _bundler!: Bundler;
    private _paymaster!: IPaymaster;

    /**
     * Creates a smart account for a given private key and chain ID.
     * @param {string} privateKey - The private key of the wallet.
     * @param {string} rpcUrl - The rpc url for the waller.
     * @returns {Promise<void>}
     */
    private async createSmartAccount(rpcUrl: string, chainId: number) {
        try {
            const smartAccountConfig: BiconomySmartAccountV2Config = {
                signer: this._signer,
                bundlerUrl: this._bundler.getBundlerUrl(),
                paymaster: this._paymaster,
                rpcUrl,
                chainId,
            };

            this._smartAccount = await createSmartAccountClient(
                smartAccountConfig,
            );
        } catch (error: any) {
            logger.error(`Failed to create smart account: ${error.stack}`);
        }
    }

    /**
     * Creates a smart account service.
     * @param {string} privateKey - The private key of the wallet.
     * @param {string} rpcUrl - The rpc url for the wallet.
     * @returns {Promise<SmartAccountService>} The smart account service.
     */
    public static async create(privateKey: string, rpcUrl: string) {
        const instance = new SmartAccountService();

        const walletService = await WalletService.create(privateKey, rpcUrl);
        instance._signer = walletService.signer;

        const chainId = Number(
            (await instance._signer.provider?.getNetwork())?.chainId,
        );

        const bundlerService = await BundlerService.create(chainId);
        instance._bundler = bundlerService.bundler;

        if (env.paymasterUrl) {
            const paymasterService = await PaymasterService.create(
                env.paymasterUrl,
            );
            instance._paymaster = paymasterService.paymaster;
        }

        await instance.createSmartAccount(rpcUrl, chainId);

        return instance;
    }

    /**
     * @returns {BiconomySmartAccountV2} The smart account.
     */
    public get smartAccount() {
        return this._smartAccount;
    }

    /**
     * @returns {Wallet} The signer.
     */
    public get signer() {
        return this._signer;
    }

    /**
     * @returns {Bundler} The bundler.
     */
    public get bundler() {
        return this._bundler;
    }

    /**
     * @returns {IPaymaster} The paymaster.
     */
    public get paymaster() {
        return this._paymaster;
    }
}

export default SmartAccountService;
