import env from "@config/index";
import logger from "@shared/lib/logger";
import MintService from "./apis/mint/mint.service";
import SmartAccountService from "./apis/smart-account/smart-account.service";
import { PaymasterMode } from "@biconomy/account";

process.on("uncaughtException", (err) => {
    logger.error(err.stack!);
});

process.on("unhandledRejection", (reason, _) => {
    logger.error(reason as string);
});

async function main() {
    const privateKey = env.privateKey;
    const rpcUrl = env.rpcUrl;

    const { smartAccount } = await SmartAccountService.create(
        privateKey,
        rpcUrl,
    );

    const mintService = new MintService(smartAccount);

    const { transactionHash } = await mintService.mint({
        tokenAddress: "0x9Ea1425DA65be04E35410DeD2ECC5442A59d6A8D",
        mintAmount: 30,
        decimals: 18,
        paymasterMode: PaymasterMode.SPONSORED,
    });

    console.log(transactionHash);
}

main().catch(console.error);
