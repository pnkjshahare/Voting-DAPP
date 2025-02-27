import { useState, useEffect } from "react";
import getWeb3 from "./utils/getWeb3";
import VotingContract from "./contracts/Voting.json";
import VotingForm from "./components/VotingForm";
import CandidateList from "./components/CandidateList";
import ResultDisplay from "./components/ResultDisplay";
import "./App.css";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance
        const web3Instance = await getWeb3();
        setWeb3(web3Instance);

        // Get user accounts
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        // Get the contract instance
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = VotingContract.networks[networkId];

        if (!deployedNetwork) {
          throw new Error(
            "Contract not deployed to the detected network. Please check your network settings."
          );
        }

        const contractInstance = new web3Instance.eth.Contract(
          VotingContract.abi,
          deployedNetwork.address
        );

        setContract(contractInstance);

        // Load initial data
        await loadCandidates(contractInstance);

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts) => {
          setAccounts(accounts);
        });

        setLoading(false);
      } catch (error) {
        console.error("Error initializing web3:", error);
        setError(
          "Failed to load blockchain data. Please make sure you have MetaMask installed and connected to the correct network."
        );
        setLoading(false);
      }
    };

    init();
  }, []);

  const loadCandidates = async (contractInstance) => {
    try {
      setLoading(true);
      const instance = contractInstance || contract;

      if (!instance) return;

      const result = await instance.methods.getCandidates().call();

      const formattedCandidates = result[0].map((id, index) => ({
        id: parseInt(id),
        name: result[1][index],
        voteCount: parseInt(result[2][index]),
      }));

      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Error loading candidates:", error);
      setError("Error loading candidates from the blockchain.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !error) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Connecting to blockchain...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="my-4 text-center">
        <h1>Decentralized Voting Application</h1>
        <p className="lead">Cast your vote on the Ethereum blockchain</p>

        {accounts.length > 0 && (
          <div className="alert alert-info">
            Connected Account: {accounts[0]}
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}
      </header>

      <div className="row">
        <div className="col-md-6">
          {web3 && contract && accounts.length > 0 ? (
            <VotingForm
              web3={web3}
              contract={contract}
              account={accounts[0]}
              refreshCandidates={() => loadCandidates()}
            />
          ) : (
            <div className="alert alert-warning">
              Please connect your MetaMask wallet to vote.
            </div>
          )}
        </div>

        <div className="col-md-6">
          <ResultDisplay contract={contract} loading={loading} />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <CandidateList candidates={candidates} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default App;
