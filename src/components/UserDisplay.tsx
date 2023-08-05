import { RandomAvatar } from "react-random-avatars"
import { shorten_hex } from "../util"

interface AccountDisplayProps {
    account: string
}

export default (props: AccountDisplayProps) => <p>
    <RandomAvatar name={props.account} size={64}/> {shorten_hex(props.account)}
</p>