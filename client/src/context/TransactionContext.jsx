import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

  return transactionContract;
};

export const TransactionProvider = ({children}) => {
  const[currentAccount, setCurrentAccount] = useState('');
  const[formData, setFormData] = useState({addressTo: '', amount: '', keyword:'', message:''});
  const[isLoading, setIsLoading] = useState(false);
  const[transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
  const[transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({...prevState, [name]: e.target.value}));
  };

  const getAllTransactions = async() => {
    try {
      if(!ethereum) return alert("Please install MetaMask!");
      const transactionContract = getEthereumContract();
      const availableTransactions = await transactionContract.getAllTransactions();
      
      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }))
      
      console.log(structuredTransactions);
      setTransactions(structuredTransactions);
    } catch (error) {
      console.log(error);
    }
  };

  const checkWalletConnected = async() => {
    try {
      if(!ethereum) return alert("Please install MetaMask!");
      const accounts = await ethereum.request({method: 'eth_accounts'});

      if(accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else { console.log("No accounts found.")}
    } catch(error) {
      console.log(error);
      throw new Error("No Ethereum object.");
    }
  };

  const checkTransactionsExist = async() => {
    try {
        if(ethereum) {
          const transactionContract = getEthereumContract();
          const transactionCount = await transactionContract.getTransactionCount();
          
          window.localStorage.setItem('transactionCount', transactionCount);
      }
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object.");
    }
  };

  const connectWallet = async() => {
    try {
      if(!ethereum) return alert("Please install MetaMask!");
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      setCurrentAccount(accounts[0]);
    } catch(error) {
        console.log(error);
        throw new Error("No Ethereum object.");
    }
  };

  const sendTransaction = async() => {
    try {
      if(!ethereum) return alert("Please install MetaMask!");
      // Get the data from the form
      const {addressTo, amount, keyword, message} = formData;
      const transactionContract = getEthereumContract();
      // Converts decimal amount into GWEI hexadecimal amoint
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: '0x5208', // 21000 GWEI == 0.000021 ETH
          value: parsedAmount._hex
        }]
      });

      // Store transaction
      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);

      // Wait for the transaction to go through
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      // Get the number of transactions
      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());
      
      window.reload();
    } catch(error) {
        console.log(error);
        throw new Error("No Ethereum object.");
    }
  };

  useEffect(() => {
    checkWalletConnected();
    checkTransactionsExist();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider value={{connectWallet, currentAccount, formData, handleChange, sendTransaction, transactions, isLoading}}>
      {children}
    </TransactionContext.Provider>
  );
};