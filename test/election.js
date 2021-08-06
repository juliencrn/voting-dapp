const Election = artifacts.require("Election.sol");

contract('Election', accounts => {
  it("Smoke test", async () => {
    const instance = await Election.deployed()
    const candidate = await instance.getCandidate()

    assert.equal(candidate, "Candidate 1")
  });
});
