import * as randomWords from "random-words"
export const get_slug = (account: string) => randomWords.generate({ exactly: 4, seed: account }).join("-")

export const shorten_hex = (hex: string) => `${hex.slice(0, 6)}...${hex.slice(62, 66)}`