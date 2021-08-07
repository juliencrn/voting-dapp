import React, { useState, useEffect } from "react"
import CandidatesTable from "./CandidatesTable";

import ElectionContract from "./contracts/Election.json"
import getWeb3 from './getWeb3';
import VoteForm from "./VoteForm";

function App() {
  const [state, setState] = useState({
    web3: null,
    accounts: null,
    contract: null,
    canVote: false,
    candidates: []
  })

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
        const contract = new web3.eth.Contract(
          ElectionContract.abi,
          deployedNetwork && deployedNetwork.address
        )

        // Fetch candidates
        let candidates = []
        const candidateCount = await contract.methods.candidateCount().call()
        for (let i = 1; i <= Number(candidateCount); i++) {
          const candidate = await contract.methods.candidates(i).call()
          candidates.push(candidate)
        }

        // Check if the current user has voted
        const hasVoted = await contract.methods.voters(accounts[0]).call()

        // Vote event listener
        listenVotes(contract)

        // Save all that in the component state
        setState(s => ({ ...s, web3, accounts, contract, candidates, canVote: !hasVoted }))

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    })()
  }, [])

  const vote = async (candidateId) => {
    if (state.web3 && state.contract && state.accounts) {
      await state.contract.methods
        .vote(candidateId)
        .send({ from: state.accounts[0] })
    }
  }

  const listenVotes = async contract => {
    const votedEvent = await contract.events.VotedEvent()
    votedEvent
      // Increment candidate vote
      .on("data", event => {
        const candidateId = event.returnValues.candidateId
        setState(s => ({
          ...s,
          canVote: false,
          candidates: s.candidates.map(
            candidate => candidate.id === candidateId
              ? ({ ...candidate, voteCount: Number(candidate.voteCount) + 1 })
              : candidate
          )
        }))
      })
      .on("error", console.error)
  }

  if (!state.web3 || state.accounts.length === 0) {
    return (
      <div className="min-h-screen flex justify-center align-middle">
        <p className="m-auto pb-20">Loading Web3, accounts, and contract...</p>
      </div>
    )
  }

  return (
    <main className="w-full container mx-auto max-w-3xl">
      <h1 className="mb-4 mt-4 sm:mt-8 md:mt-16 text-4xl md:text-5xl text-white font-bold leading-tight">
        Voting dapp
      </h1>

      <hr className="my-6" />

      {state.candidates.length > 0 ? (
        <>
          <CandidatesTable candidates={state.candidates} />

          <VoteForm
            candidates={state.candidates}
            canVote={state.canVote}
            onVote={vote}
          />
        </>
      ) : (
        <p className="m-auto py-8">There is no candidates yet.</p>
      )}

      <hr className="my-6" />

      <p className="text-center pb-6">Your account: {state.accounts[0]}</p>

      <hr className="py-6" />
    </main>
  );
}

export default App;
//115