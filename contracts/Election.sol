pragma solidity >=0.4.22 <0.9.0;

contract Election {
    string candidate;

    constructor() public {
        candidate = "Candidate 1";
    }

    function getCandidate() public view returns (string memory) {
        return candidate;
    }
}
