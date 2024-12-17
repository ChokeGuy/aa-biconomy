import { PaymasterMode } from "@biconomy/account";

type BaseMintConfig = {
    tokenAddress: string;
    mintAmount: number;
    decimals: number;
};

type SponsoredMintConfig = {
    paymasterMode: PaymasterMode.SPONSORED;
};

type ERC20MintConfig = {
    paymasterMode: PaymasterMode.ERC20;
    preferredToken: string;
};

type MintConfig = BaseMintConfig & (ERC20MintConfig | SponsoredMintConfig);

type MintResult = {
    success: boolean;
    transactionHash?: string;
    error?: string;
};

export type { MintConfig, MintResult };
