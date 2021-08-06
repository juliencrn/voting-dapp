pragma solidity >=0.4.22 <0.9.0;

contract Election {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // Read/Write candidates
    mapping(uint256 => Candidate) public candidates;

    // Used to access to the candidates mapping
    uint256 public candidateCount;

    constructor() public {
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }

    function addCandidate(string memory _name) private {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }
}
