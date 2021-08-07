import React, { useState, useEffect } from "react"

import ElectionContract from "./contracts/Election.json"
import getWeb3 from './getWeb3';

function App() {
  const [state, setState] = useState({
    web3: null,
    accounts: null,
    contract: null
  })

  const [selected, setSelected] = useState(1)
  const [canVote, setCanVote] = useState(false)
  const [candidates, setCandidates] = useState([])

  // Init web3 on mount
  useEffect(() => {
    (async () => {
      try {
        // Get network provider and web3 instance
        const web3 = await getWeb3()

        // Use web3 to get the user's accounts
        const accounts = await web3.eth.getAccounts()

        // Get the contract instance.
        const networkId = await web3.eth.net.getId()
        const deployedNetwork = ElectionContract.networks[networkId]
        const instance = new web3.eth.Contract(
          ElectionContract.abi,
          deployedNetwork && deployedNetwork.address
        )

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setState(prevState => ({
          ...prevState,
          web3,
          accounts,
          contract: instance,
        }))

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    })()
  }, [])

  useEffect(() => {
    if (state.web3 && state.contract) {
      (async () => {
        // Fetch candidates
        let candidates = []
        const candidateCount = await state.contract.methods.candidateCount().call()
        for (let i = 1; i <= Number(candidateCount); i++) {
          const candidate = await state.contract.methods.candidates(i).call()
          candidates.push(candidate)
        }
        setCandidates(candidates)

        // Check if the current user can vote
        const hasVoted = await state.contract.methods.voters(state.accounts[0]).call()
        setCanVote(!hasVoted)
      })()
    }
  }, [state.web3, state.contract, state.accounts])

  const handleSubmit = e => {
    e.preventDefault()

    vote(selected)
  }

  const vote = async (candidateId) => {
    if (state.web3 && state.contract && state.accounts) {
      await state.contract.methods
        .vote(candidateId)
        .send({ from: state.accounts[0] })
    }
  }

  const handleSelect = e => {
    setSelected(Number(e.target.value))
  }

  if (!state.web3 || state.accounts.length === 0) {
    return (
      <div className="min-h-screen flex justify-center align-middle">
        <p className="m-auto pb-20">Loading Web3, accounts, and contract...</p>
      </div>
    )
  }

  const classes = {
    th: "px-6 py-3 text-left text-xs font-bold text-gray-100 uppercase tracking-wider",
    td: "px-6 py-4 whitespace-nowrap"
  }

  return (
    <main className="w-full container mx-auto max-w-3xl">
      <h1 className="mb-4 mt-4 sm:mt-8 text-4xl md:text-5xl text-white font-bold leading-tight">
        Voting dapp
      </h1>

      <hr className="my-6" />

      {candidates.length > 0 ? (
        <>
          <div className="overflow-hidden border-gray-300 py-6">
            <table className="min-w-full divide-y divide-gray-300 border-b">
              <thead>
                <tr>
                  <th scope="col" className={classes.th}>#</th>
                  <th scope="col" className={classes.th}>Name</th>
                  <th scope="col" className={classes.th}>Votes</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-300 border-b">
                {candidates.map(({ id, name, voteCount }) => (
                  <tr key={id}>
                    <td className={classes.td}>{id}</td>
                    <td className={classes.td}>{name}</td>
                    <td className={classes.td}>{voteCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="my-4 text-left text-xl md:text-xl text-white font-bold leading-tight">Select Candidate</h3>
            <form noValidate onSubmit={handleSubmit}>
              <select disabled onChange={handleSelect} className="px-6 py-3 bg-transparent rounded w-full border focus:outline-none">
                {candidates.map(({ id, name }) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
              {canVote ? (
                <button type="submit" className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-6 rounded`}>
                  Vote
                </button>
              ) : (
                <p className="font-bold text-sm py-2 mb-6">You already have voted.</p>
              )}

            </form>
          </div>
        </>
      ) : (
        <p className="m-auto py-8">Loading Web3, accounts, and contract...</p>
      )}

      <hr className="my-6" />

      <p className="text-center pb-6">Your account: {state.accounts[0]}</p>

      <hr className="py-6" />
    </main>
  );
}

export default App;
