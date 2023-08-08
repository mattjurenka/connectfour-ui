import { TransactionBlock, Wallet } from "ethos-connect";
import { accept_challenge_func, challenge_func, make_move_red_func, make_move_yellow_func, revoke_challenge_func } from "./globals";

export const challenge = (wallet: Wallet, opponent: string, stake: number) => {
    const transactionBlock = new TransactionBlock()
    const [coin] = transactionBlock.splitCoins(transactionBlock.gas, [transactionBlock.pure(Math.round(stake * 1_000_000_000))])
    const [revoke_cap] = transactionBlock.moveCall({
        target: challenge_func,
        arguments: [
            transactionBlock.pure(opponent, "address"),
            coin
        ]
    })
    transactionBlock.setGasBudget(1_00_000_000)
    wallet.signAndExecuteTransactionBlock({ transactionBlock })
}

export const revoke_challenge = (wallet: Wallet, challenge: string, challenge_cap: string) => {
    const transactionBlock = new TransactionBlock()
    transactionBlock.moveCall({
        target: revoke_challenge_func,
        arguments: [
            transactionBlock.object(challenge),
            transactionBlock.object(challenge_cap)
        ]
    })
    transactionBlock.setGasBudget(1_00_000_000)
    wallet.signAndExecuteTransactionBlock({ transactionBlock })
}

export const accept_challenge = (wallet: Wallet, challenge: string, challenge_cap: string) => {
    const transactionBlock = new TransactionBlock()
    transactionBlock.moveCall({
        target: accept_challenge_func,
        arguments: [
            transactionBlock.object(challenge),
            transactionBlock.object(challenge_cap),
            transactionBlock.object(`0x${"0".repeat(63)}6`)
        ]
    })
    transactionBlock.setGasBudget(1_00_000_000)
    wallet.signAndExecuteTransactionBlock({ transactionBlock })
}

export const make_move = (wallet: Wallet, game: string, participant_cap: string, col: number, is_yellow: boolean) => {
    const transactionBlock = new TransactionBlock()
    transactionBlock.moveCall({
        target: is_yellow? make_move_yellow_func : make_move_red_func,
        arguments: [
            transactionBlock.object(participant_cap),
            transactionBlock.object(game),
            transactionBlock.pure(col)
        ]
    })
    transactionBlock.setGasBudget(10000000)
    wallet.signAndExecuteTransactionBlock({ transactionBlock })
}