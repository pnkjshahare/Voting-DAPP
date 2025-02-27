// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    // Structure to represent a candidate
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // Owner of the contract
    address public owner;
    
    // Mapping from candidate ID to Candidate
    mapping(uint256 => Candidate) public candidates;
    
    // Mapping to track if an address has voted
    mapping(address => bool) public hasVoted;
    
    // Total number of candidates
    uint256 public candidatesCount;
    
    // Event fired when a new vote is cast
    event VoteCast(address indexed voter, uint256 candidateId);
    
    // Event fired when a new candidate is added
    event CandidateAdded(uint256 candidateId, string name);

    constructor() {
        owner = msg.sender;
        
        // Add some initial candidates
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
        addCandidate("Candidate 3");
    }
    
    // Modifier to ensure only the owner can call certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    // Function to add a new candidate (only by owner)
    function addCandidate(string memory _name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }
    
    // Function to vote for a candidate
    function vote(uint256 _candidateId) public {
        // Check if the voter has already voted
        require(!hasVoted[msg.sender], "You have already voted");
        
        // Check if the candidate exists
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        
        // Record that the voter has voted
        hasVoted[msg.sender] = true;
        
        // Increment the candidate's vote count
        candidates[_candidateId].voteCount++;
        
        // Emit an event
        emit VoteCast(msg.sender, _candidateId);
    }
    
    // Function to get all candidates
    function getCandidates() public view returns (uint256[] memory, string[] memory, uint256[] memory) {
        uint256[] memory ids = new uint256[](candidatesCount);
        string[] memory names = new string[](candidatesCount);
        uint256[] memory voteCounts = new uint256[](candidatesCount);
        
        for (uint256 i = 1; i <= candidatesCount; i++) {
            Candidate storage candidate = candidates[i];
            ids[i-1] = candidate.id;
            names[i-1] = candidate.name;
            voteCounts[i-1] = candidate.voteCount;
        }
        
        return (ids, names, voteCounts);
    }
    
    // Function to check if an address has already voted
    function checkVoteStatus(address _voter) public view returns (bool) {
        return hasVoted[_voter];
    }
    
    // Function to get the winner (candidate with the most votes)
    function getWinner() public view returns (uint256, string memory, uint256) {
        require(candidatesCount > 0, "No candidates available");
        
        uint256 winningId = 1;
        uint256 maxVotes = candidates[1].voteCount;
        
        for (uint256 i = 2; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                winningId = i;
                maxVotes = candidates[i].voteCount;
            }
        }
        
        return (
            candidates[winningId].id,
            candidates[winningId].name,
            candidates[winningId].voteCount
        );
    }
}