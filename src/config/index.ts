import * as dotenv from "dotenv";
import { NodeEnv } from "@shared/constant/config";

dotenv.config();

type Config = {
    port: number;
    nodeEnv: NodeEnv;
    writeLogFile: boolean;
    bundlerPrexUrl: string;
    biconomyApiKey: string;
    privateKey: string;
    paymasterUrl: string;
    paymasterStrictMode: boolean;
    rpcUrl: string;
};

const config: Config = {
    port: Number(process.env.port ?? "5000"),
    nodeEnv: (process.env.NODE_ENV as NodeEnv) ?? NodeEnv.DEV,
    writeLogFile: process.env.NODE_ENV !== "DEV",
    bundlerPrexUrl: process.env.BUNDLER_PREFIX_URL!,
    biconomyApiKey: process.env.BICONOMY_API_KEY!,
    privateKey: process.env.PRIVATE_KEY!,
    paymasterUrl: process.env.PAYMASTER_URL!,
    paymasterStrictMode: process.env.NODE_ENV === "DEV" ? true : false,
    rpcUrl: process.env.RPC_URL!,
};

export default config;
