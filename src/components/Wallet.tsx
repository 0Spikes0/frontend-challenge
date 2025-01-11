import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { IconButton } from "@mui/material";

const Wallet: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>("Unknown Network");
  const [balance, setBalance] = useState<string | null>(null);
  const [usdValue, setUsdValue] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const fetchConversionRate = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      return data.ethereum.usd;
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
      return 0;
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed. Please install it to use this feature.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      setWalletAddress(account);

      const network = await provider.getNetwork();
      setNetworkName(network.name);

      const rawBalance = await provider.getBalance(account);
      const formattedBalance = ethers.formatEther(rawBalance);
      setBalance(formattedBalance);

      const dynamicRate = await fetchConversionRate();
      const usdValue = (parseFloat(formattedBalance) * dynamicRate).toFixed(2);
      setUsdValue(usdValue);

      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  const shortenAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress).then(
        () => alert("Wallet address copied to clipboard!"),
        (err) => console.error("Failed to copy wallet address:", err)
      );
    }
  };

  const viewInExplorer = () => {
    if (!walletAddress) return;

    const explorerBaseUrl = "https://etherscan.io/address/";
    const explorerUrl = `${explorerBaseUrl}${walletAddress}`;
    window.open(explorerUrl, "_blank");
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {!isConnected ? (
        <div className="flex flex-col items-center text-center">
          <img
            src="../../assets/metamask.svg"
            alt="MetaMask Logo"
            className="w-20 mb-4"
          />
          <h1 className="text-2xl font-bold">MetaMask</h1>
          <p className="mt-2 text-gray-400">Please connect your wallet.</p>
          <button
            onClick={connectWallet}
            className="mt-6 px-6 py-2 bg-green-600 rounded-lg text-white hover:bg-green-500 transition"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-lg shadow-md w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="../../assets/metamask.svg"
                alt="MetaMask Icon"
                className="h-6 w-6"
              />
              <h1 className="text-lg font-semibold">{networkName}</h1>
            </div>
            <span className="text-green-500">● Connected</span>
          </div>

          {/* Wallet Info */}
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="font-mono text-sm truncate">{shortenAddress(walletAddress)}</p>
            </div>

            {/* Action Buttons with MUI Icons */}
            <div className="flex items-center space-x-4 mt-2">
              {/* Copy Address Button */}
              <IconButton onClick={copyToClipboard} color="primary">
                <ContentCopyIcon />
              </IconButton>
              {/* View in Explorer Button */}
              <IconButton onClick={viewInExplorer} color="primary">
                <OpenInNewIcon />
              </IconButton>
            </div>
          </div>

          {/* Balance Info */}
          <div className="mt-6 text-center">
            <h2 className="text-lg font-semibold">Total Balance</h2>
            <p className="text-3xl font-bold">{balance || "0.00"} ETH</p>
            <p className="text-xl">
              {usdValue && usdValue !== "0.00" ? `$${usdValue}` : "Conversion unavailable"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;