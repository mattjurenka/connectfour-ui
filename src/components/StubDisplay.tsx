import { get_slug } from "../util"

interface StubDisplayProps {
    id: string
}

export default (props: StubDisplayProps) => <p style={{
    textDecoration: "underline",
    cursor: "pointer"
}} title={props.id} onClick={_ => {
    navigator.clipboard.writeText(props.id)
}}>{get_slug(props.id)}</p>