const Election = artifacts.require("Election.sol");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

contract('Election', accounts => {
  it("should initiate with right candidates", async () => {
    const election = await Election.deployed()

    const candidate1 = await election.candidates(1)
    assert.equal(candidate1.id, 1, "Id is correct")
    assert.equal(candidate1.name, "Candidate 1", "Name is correct")
    assert.equal(candidate1.voteCount, 0, "Vote count is correct")

    const candidate2 = await election.candidates(2)
    assert.equal(candidate2.id, 2, "Id is correct")
    assert.equal(candidate2.name, "Candidate 2", "Name is correct")
    assert.equal(candidate2.voteCount, 0, "Vote count is correct")

    const candidateCount = await election.candidateCount()
    assert.equal(candidateCount, 2, "Candidate count is 2")
  });

  it("allows to vote", async () => {
    const election = await Election.deployed()
    const voter = accounts[0]
    const candidateId = 1

    // Vote
    const _receipt = await election.vote(candidateId, { from: voter })

    const voted = await election.voters(voter)
    assert.equal(voted, true, "the voter was marked as voted")

    const candidate = await election.candidates(candidateId)
    assert.equal(candidate.voteCount, 1, "increments the candidate's vote count")
  })

  it("throws an exception for invalid candidate", async () => {
    const election = await Election.deployed()

    try {
      const receipt = await election.vote(99, { from: accounts[1] })
      assert.fail(receipt)
    } catch (error) {
      assert(
        error.message.includes("revert"),
        "Error message must contain \"revert\""
      )
    }

    const candidate1 = await election.candidates(1)
    assert.equal(candidate1.voteCount, 1, "candidate 1 did receive any votes")

    const candidate2 = await election.candidates(2)
    assert.equal(candidate2.voteCount, 0, "candidate 2 did receive any votes")
  })

  it("throws an exception for double voting", async () => {
    const election = await Election.deployed()
    const candidateId = 2
    const voter = accounts[2]

    let receipt = await election.vote(candidateId, { from: voter })
    const candidate = await election.candidates(candidateId)
    assert.equal(candidate.voteCount, 1, "accepts first vote")

    try {
      receipt = await election.vote(candidateId, { from: voter })
      assert.fail(receipt)
    } catch (error) {
      assert(
        error.message.includes("revert"),
        "Error message must contain \"revert\""
      )
    }

    const candidate1 = await election.candidates(1)
    assert.equal(candidate1.voteCount, 1, "candidate 1 did receive any votes")

    const candidate2 = await election.candidates(2)
    assert.equal(candidate2.voteCount, 1, "candidate 2 did receive any votes")
  })

  it("should trigger an event when a vote was submitted", async () => {
    const election = await Election.deployed()
    const candidateId = 1
    const voter = accounts[3]

    // Vote
    const receipt = await election.vote(candidateId, { from: voter })

    // Check if the event is triggered with the good value
    truffleAssert.eventEmitted(receipt, 'VotedEvent', event => event.candidateId == 1)
  });
});
