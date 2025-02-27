const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  let votingInstance;
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];

  beforeEach(async () => {
    votingInstance = await Voting.new({ from: owner });
  });

  it("initializes with three candidates", async () => {
    const count = await votingInstance.candidatesCount();
    assert.equal(count, 3, "Should have three candidates initially");
  });

  it("allows a voter to cast a vote", async () => {
    const candidateId = 1;
    await votingInstance.vote(candidateId, { from: voter1 });

    const hasVoted = await votingInstance.hasVoted(voter1);
    assert.equal(hasVoted, true, "Voter should be marked as having voted");

    const candidate = await votingInstance.candidates(candidateId);
    assert.equal(
      candidate.voteCount,
      1,
      "Candidate should have received one vote"
    );
  });

  it("prevents a voter from voting twice", async () => {
    const candidateId = 1;
    await votingInstance.vote(candidateId, { from: voter1 });

    try {
      await votingInstance.vote(candidateId, { from: voter1 });
      assert.fail("Expected to throw an error");
    } catch (error) {
      assert(
        error.message.includes("You have already voted"),
        "Expected error message"
      );
    }
  });

  it("requires a valid candidate ID", async () => {
    const invalidCandidateId = 99;

    try {
      await votingInstance.vote(invalidCandidateId, { from: voter1 });
      assert.fail("Expected to throw an error");
    } catch (error) {
      assert(
        error.message.includes("Invalid candidate ID"),
        "Expected error message"
      );
    }
  });

  it("allows only the owner to add a candidate", async () => {
    await votingInstance.addCandidate("Candidate 4", { from: owner });
    const count = await votingInstance.candidatesCount();
    assert.equal(count, 4, "Should now have four candidates");

    try {
      await votingInstance.addCandidate("Candidate 5", { from: voter1 });
      assert.fail("Expected to throw an error");
    } catch (error) {
      assert(
        error.message.includes("Only the owner can call this function"),
        "Expected error message"
      );
    }
  });

  it("retrieves all candidates correctly", async () => {
    const result = await votingInstance.getCandidates();
    const ids = result[0].map((id) => id.toNumber());
    const names = result[1];
    const voteCounts = result[2].map((count) => count.toNumber());

    assert.equal(ids.length, 3, "Should return three candidate IDs");
    assert.equal(names.length, 3, "Should return three candidate names");
    assert.equal(voteCounts.length, 3, "Should return three vote counts");
  });

  it("correctly determines the winner", async () => {
    await votingInstance.vote(2, { from: voter1 });
    await votingInstance.vote(2, { from: voter2 });
    await votingInstance.vote(1, { from: accounts[3] });

    const result = await votingInstance.getWinner();
    const winnerId = result[0].toNumber();
    const winnerName = result[1];
    const winnerVotes = result[2].toNumber();

    assert.equal(winnerId, 2, "Candidate 2 should be the winner");
    assert.equal(
      winnerName,
      "Candidate 2",
      "Winner name should be 'Candidate 2'"
    );
    assert.equal(winnerVotes, 2, "Winner should have 2 votes");
  });
});
