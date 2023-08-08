import { Wallet } from "ethos-connect"
import * as randomWords from "random-words"
export const get_slug = (account: string) => randomWords.generate({ exactly: 4, seed: account }).join("-")

export const shorten_hex = (hex: string) => `${hex.slice(0, 6)}...${hex.slice(62, 66)}`

export interface CacheEntry {
    status: "cached" | "uninit" | "deleted",
    data: any
}
const objects_cache: {[key: string]: CacheEntry} = {}
export const cache_wallet: { wall: Wallet | null, on_update: (n: number) => void} = {wall: null, on_update: () => {}}

export const ensure_in_cache = (addresses: string[]) => {
    addresses.forEach(address => {
        if (!(address in objects_cache)) {
            objects_cache[address] = { status: "uninit", data: null }
        }
    })
}

export const get_from_cache = (key: string): CacheEntry => {
    return objects_cache[key]
}

let iter = 0;
setInterval(async () => {
    console.log(cache_wallet, objects_cache)
    if (cache_wallet.wall) {
        (await Promise.all(Object.entries(objects_cache)
            .filter(([_, val]) => val.status != "deleted")
            .map(([address, _]) => cache_wallet.wall?.provider.getObject({
                id: address,
                options: {
                    showContent: true
                }
            }))))
            .forEach(r => {
                const obj = r?.data?.objectId || ""
                objects_cache[obj] = { status: "cached", data: r?.data?.content || {}}
            })
        cache_wallet.on_update(iter)
        iter += 1
    }
}, 5 * 1000)

