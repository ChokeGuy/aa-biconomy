/**
 * Error thrown when minting token fails
 */
class MintTokenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MintTokenError";
    }
}

export default MintTokenError;
