import { IPaymaster, createPaymaster } from "@biconomy/account";
import logger from "@shared/lib/logger";
import env from "@config/index";

class PaymasterService {
    private _paymaster!: IPaymaster;

    /**
     * Creates a paymaster service.
     * @param {string} paymasterUrl - Paymaster URL.
     */
    private async createPaymaster(paymasterUrl: string) {
        try {
            this._paymaster = await createPaymaster({
                paymasterUrl,
                strictMode: env.paymasterStrictMode,
            });
        } catch (error: any) {
            logger.error("Error creating paymaster", error.stack);
        }
    }

    /**
     * Creates a paymaster service.
     * @param {string} paymasterUrl - Paymaster URL.
     * @returns {Promise<PaymasterService>} The paymaster service.
     */
    public static async create(paymasterUrl: string) {
        const instance = new PaymasterService();

        await instance.createPaymaster(paymasterUrl);

        return instance;
    }

    /**
     * Returns the paymaster.
     * @returns {IPaymaster} The paymaster.
     */
    public get paymaster() {
        return this._paymaster;
    }
}

export default PaymasterService;
