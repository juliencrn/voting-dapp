const Election = artifacts.require("Election.sol");

contract('Election', accounts => {
  it("should initiate with right candidates", async () => {
    const instance = await Election.deployed()

    const candidate1 = await instance.candidates(1)

    assert.equal(candidate1[0], 1, "Id is correct")
    assert.equal(candidate1[1], "Candidate 1", "Name is correct")
    assert.equal(candidate1[2], 0, "Vote count is correct")

    const candidate2 = await instance.candidates(2)

    assert.equal(candidate2[0], 2, "Id is correct")
    assert.equal(candidate2[1], "Candidate 2", "Name is correct")
    assert.equal(candidate2[2], 0, "Vote count is correct")
  });
});
