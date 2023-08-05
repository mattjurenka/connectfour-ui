import { useState } from 'react'
import './App.css'
import { Chain, SignInButton, TransactionBlock } from 'ethos-connect'
import { ethos } from "ethos-connect"
import { game_type, sui_devnet_package } from './globals'
import UserDisplay from './components/UserDisplay'
import { get_slug } from './util'
import StubDisplay from './components/StubDisplay'

function App() {
  const { wallet } = ethos.useWallet();
  const [address, set_address] = useState("")
  const { signer } = ethos.useProviderAndSigner();

  if (!wallet) {
    return <SignInButton />
  }

  return (
    <>
      <h1>Connect Four</h1>
      <input 
        onChange={e => set_address(e.target.value)}
        value={address}
        placeholder="Enter a sui address to challenge"
        style={{width: "50%"}}
      />
      <br />
      <button onClick={async _ => {

        const transactionBlock = new TransactionBlock()
        transactionBlock.moveCall({
          target: `${sui_devnet_package}::connect_four::start_game_with`,
          arguments: [
            transactionBlock.pure(address, "address")
          ]
        })
        transactionBlock.setGasBudget(1000000000)
        wallet.signAndExecuteTransactionBlock({ transactionBlock })
      }}>New Game</button>
      <button onClick={_ => {
        wallet?.disconnect()
      }}>Disconnect</button>

      {wallet?.contents?.objects.filter(object => object.type == game_type).map((object, x) => {
      const yellow: string = object?.fields?.yellow as any
      const red: string = object?.fields?.red as any
      return <>
        <div style={{ backgroundColor: wallet.address == yellow ? "yellow" : "red" }}>
        <p>Game ID: <StubDisplay id={object.objectId}/></p>
        <p>Opponent ID: <UserDisplay account={wallet.address == yellow ? red : yellow} /></p>
        <button onClick={async () => {
          
          const transactionBlock = new TransactionBlock()
          transactionBlock.moveCall({
            target: `${sui_devnet_package}::connect_four::stop_playing`,
            arguments: [
              transactionBlock.object(object.objectId)
            ]
          })
          transactionBlock.setGasBudget(1000000000)
          wallet.signAndExecuteTransactionBlock({ transactionBlock })
        }}>Stop Playing</button>
        </div>
        <div key={x} style={{
          display: "grid",
          gridTemplateRows: "repeat(7, 96px)",
          gridTemplateColumns: "repeat(7, 96px)",
        }}>
          {Array.from({length: 7}).map((_, i) => <div><button key={i} onClick={async _ => {
            const transactionBlock = new TransactionBlock()
            transactionBlock.moveCall({
              target: `${sui_devnet_package}::connect_four::make_move`,
              arguments: [
                transactionBlock.object(object.objectId),
                transactionBlock.pure(i)
              ]
            })
            transactionBlock.setGasBudget(1000000000)
            wallet.signAndExecuteTransactionBlock({ transactionBlock })
          }}>Drop</button></div>)}
          {[...((object?.fields?.board as unknown) as number[][])].reverse().map((row, i) => row.map((col, j) => <div style={{
            backgroundColor: col == 0 ? "white" : col == 1 ? "yellow" : "red",
            borderRight: "1px solid black",
            borderBottom: "1px solid black",
            borderTop: i == 0 ? "1px solid black": "none",
            borderLeft: j == 0 ? "1px solid black": "none"

          }} key={`${i}${j}`}></div>))}
        </div></>}
        )}
      </>
  )
}

export default App
