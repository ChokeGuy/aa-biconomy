import { ethers } from "ethers";
import { MintTokenError } from "@shared/error";
import { BiconomySmartAccountV2, PaymasterMode } from "@biconomy/account";
import { MintConfig, MintResult } from "./mint.types";

class MintService {
    /**
     * The default configuration for minting tokens.
     * @type {MintConfig}
     * @private
     */
    private defaultConfig: MintConfig = {
        tokenAddress: "0x9Ea1425DA65be04E35410DeD2ECC5442A59d6A8D",
        mintAmount: 20,
        decimals: 18,
        paymasterMode: PaymasterMode.SPONSORED,
    };

    /**
     * The smart account instance.
     * @type {BiconomySmartAccountV2}
     * @private
     */
    private readonly smartAccount: BiconomySmartAccountV2;

    constructor(smartAccount: BiconomySmartAccountV2) {
        this.smartAccount = smartAccount;
    }

    /**
     * Prepares the data for minting tokens.
     * @param {string} saAddress - The address of the smart account.
     * @param {MintConfig} config - The configuration for minting.
     * @returns {string} The encoded data for minting.
     * @private
     */
    private prepareMintData(saAddress: string, config: MintConfig): string {
        const iface = new ethers.Interface([
            "function mint(address to, uint256 amount)",
        ]);

        return iface.encodeFunctionData("mint", [
            saAddress,
            ethers.parseUnits(config.mintAmount.toString(), config.decimals),
        ]);
    }

    private getPaymasterData(config: MintConfig) {
        const paymasterData = {
            mode: config.paymasterMode,
        };

        if (config.paymasterMode === PaymasterMode.ERC20) {
            if (!config.preferredToken) {
                throw new MintTokenError(
                    "preferredToken required for ERC20 mode",
                );
            }
            return {
                ...paymasterData,
                preferredToken: config.preferredToken,
            };
        }

        return paymasterData;
    }

    /**
     * Mints tokens using a smart account and Biconomy paymaster
     * @param config Optional configuration for minting
     * @throws {MintTokenError} When minting fails
     * @returns {Promise<MintResult>} Result object containing transaction status and hash
     */
    public async mint(config?: MintConfig): Promise<MintResult> {
        try {
            const mintConfig = config || this.defaultConfig;

            const payMasterData = this.getPaymasterData(mintConfig);

            const saAddress = await this.smartAccount.getAccountAddress();

            const tokenData = this.prepareMintData(saAddress, mintConfig);

            const { wait } = await this.smartAccount
                .sendTransaction(
                    {
                        to: mintConfig.tokenAddress,
                        data: tokenData,
                    },
                    {
                        paymasterServiceData: {
                            ...payMasterData,
                            calculateGasLimits: true,
                        },
                    },
                )
                .catch((error) => {
                    throw new MintTokenError(
                        `Transaction failed: ${error.message}`,
                    );
                });

            const {
                receipt: { transactionHash },
                success,
            } = await wait();

            if (success !== "true") {
                throw new MintTokenError("Transaction failed during execution");
            }

            return {
                success: true,
                transactionHash,
            };
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred";
            console.error("Mint Token Error:", errorMessage);
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
}

export default MintService;
