import { useState } from 'react'
import './App.css'
import { Chain, SignInButton, TransactionBlock } from 'ethos-connect'
import { ethos } from "ethos-connect"
import { accept_challenge_cap, challenge_func, red_participant_type, revoke_challenge_cap, sui_devnet_package, yellow_participant_type } from './globals'
import UserDisplay from './components/UserDisplay'
import { cache_wallet, ensure_in_cache, get_from_cache, get_slug } from './util'
import StubDisplay from './components/StubDisplay'
import { accept_challenge, challenge, make_move, revoke_challenge } from './calls'

function App() {
  const { wallet } = ethos.useWallet();
  const [address, set_address] = useState("")
  const [stake, set_stake] = useState("")
  const { signer } = ethos.useProviderAndSigner();
  const [cache_update, set_cache_update] = useState(0)

  if (!wallet) {
    return <SignInButton />
  }
  console.log(wallet.contents)

  cache_wallet.wall = wallet
  cache_wallet.on_update = set_cache_update


  ensure_in_cache(wallet?.contents?.objects?.filter(obj => obj.type == revoke_challenge_cap)
    ?.map(obj => obj.fields?.["challenge"] || "") || [])
  ensure_in_cache(wallet?.contents?.objects?.filter(obj => obj.type == accept_challenge_cap)
    ?.map(obj => obj.fields?.["challenge"] || "") || [])
  ensure_in_cache(wallet?.contents?.objects?.filter(obj => obj.type == yellow_participant_type)
    ?.map(obj => obj.fields?.["game"] || "") || [])
  ensure_in_cache(wallet?.contents?.objects?.filter(obj => obj.type == red_participant_type)
    ?.map(obj => obj.fields?.["game"] || "") || [])

  return (
    <>
      <h1>Connect Four {cache_update}</h1>
      <input 
        onChange={e => set_address(e.target.value)}
        value={address}
        placeholder="Enter a sui address to challenge"
        style={{width: "50%"}}
      />
      <input 
        onChange={e => set_stake(e.target.value)}
        value={stake}
        placeholder="Enter an amount to challenge"
        style={{width: "50%"}}
      />
      <br />
      <button onClick={_ => challenge(wallet, address, parseFloat(stake) || 0)}>Challenge</button>
      <button onClick={_ => wallet?.disconnect()}>Disconnect</button>
      <h1>Incoming Challenges</h1>
      {wallet.contents?.objects?.filter(object => object.type == accept_challenge_cap).map((object, i) => {
        const challenge = object?.fields?.challenge || ""
        const cache_data = get_from_cache(challenge)
        console.log("CACHE:", cache_data)
        if (cache_data.status == "cached") {
          const at_stake = cache_data.data.fields.stake.fields.balance
          return <div key={i}>
            <h3>Accept Challenge with stake {at_stake}</h3>
            <button onClick={_ => accept_challenge(wallet, challenge, object.objectId)}>Accept</button>
          </div>
        } else {
          return <></>
        }
      })}
      <h1>Outgoing Challenges</h1>
      {wallet.contents?.objects?.filter(object => object.type == revoke_challenge_cap).map((object, i) => {
        const challenge = object?.fields?.challenge || ""
        const cache_data = get_from_cache(challenge)
        console.log("CACHE:", cache_data)
        if (cache_data.status == "cached") {
          const at_stake = cache_data.data.fields.stake.fields.balance
          console.log(challenge, object.objectId)
          console.log("at stake", at_stake)
          return <div key={i}>
            <h3>Revoke Challenge with stake {at_stake}</h3>
            <button onClick={_ => revoke_challenge(wallet, challenge, object.objectId)}>Revoke</button>
          </div>
        } else {
          return <></>
        }
      })}
      <h1>Ongoing Games</h1>
      {wallet.contents?.objects.filter(object => object.type == yellow_participant_type || object.type == red_participant_type).map((object, x) => {
      const game: string = object?.fields?.game as any
      const cache_data = get_from_cache(game)
      if (cache_data.status == "cached") {
        const fields = cache_data.data.fields
        if (object.type == red_participant_type && fields.game_status == 1 || object.type == yellow_participant_type && fields.game_status == 0) {
          return <>
            <div style={{ backgroundColor: object.type == yellow_participant_type ? "yellow" : "red" }}>
            <p>Game ID: <StubDisplay id={game}/></p>
            </div>
            <div key={x} style={{
              display: "grid",
              gridTemplateRows: "repeat(7, 96px)",
              gridTemplateColumns: "repeat(7, 96px)",
            }}>
              {Array.from({length: 7}).map((_, i) => <div><button key={i} onClick={async _ => {
                make_move(wallet, game, object.objectId, i, object.type == yellow_participant_type)
              }}>Drop</button></div>)}
              {[...((fields.board as unknown) as number[][])].reverse().map((row, i) => row.map((col, j) => <div style={{
                backgroundColor: col == 0 ? "white" : col == 1 ? "yellow" : "red",
                borderRight: "1px solid black",
                borderBottom: "1px solid black",
                borderTop: i == 0 ? "1px solid black": "none",
                borderLeft: j == 0 ? "1px solid black": "none"

              }} key={`${i}${j}`}></div>))}
            </div></>
          }
        }
        return <></>
      }
        )}
      </>
  )
}

export default App
