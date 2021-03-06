import React, {useContext} from "react";
import {AiFillPlayCircle, AiOutlineEyeInvisible, AiOutlineEye} from 'react-icons/ai';
import {SiEthereum} from 'react-icons/si';
import {BsInfoCircle} from 'react-icons/bs';
import {TransactionContext} from '../context/TransactionContext';
import {shortenAddress} from "../utils/shortenAddress";
import {Loader} from './';

const Input = ({placeholder, name, type, value, handleChange}) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Welcome = () => {
  const {connectWallet, currentAccount, walletBalance, formData, handleChange, sendTransaction, isLoading} = useContext(TransactionContext);

  const handleSubmit = (e) => {
    const {addressTo, amount, keyword, message} = formData;
    e.preventDefault();
    // Check if transaction should be sent
    if(!addressTo || !amount || !keyword || !message) return;
    sendTransaction();
  };

  function toggleWalletText() {
    var walletText = document.getElementById("balanceText");
    if (walletText.innerText === "x x x x x x x x x x x x x x x") {
      walletText.innerText = walletBalance;
    } else {
      walletText.innerText = "x x x x x x x x x x x x x x x";
    }
  };

  return (
    <div className="flex w-full justify-center items-center pb-2">
      <div className="flex mf:flex-row flex-col items-start md:p-20 py-12 px-6">
        <div className="flex flex-1 justify-center lg:items-start items-center flex-col mf:mr-10">
          <h1 className="title-text text-5xl text-gradient py-5">
            Send Ethereum Across the World!
          </h1>
          <h2 className="subtitle-text text-white text-start text-xl mt-5 lg:w-10/12">
            Explore the crypto world and send Ethereum to any address easily.
          </h2>

          {!currentAccount && (
            <button
              type="button"
              onClick={connectWallet}
              className="flex flex-row justify-center items-center w-full lg:w-2/3 my-6 bg-[#ffffff] p-4 rounded-2xl cursor-pointer hover:bg-[#e7e7e7]"
              >
                <AiFillPlayCircle className="text-black ml-3 mr-5"/>
                <p className="text-black font-semibold mr-5">Connect Wallet</p>
            </button>
          )}

          {currentAccount && (
            <div className="text-white justify-center text-start items-start mt-14">
              <h1 className='text-5xl'>Ethereum Balance</h1>
              <div className="toggle-contents">
                <h2 id="balanceText" className='text-xl mt-6'>{walletBalance}</h2>
                <button
                  id="toggleButton"
                  type="button"
                  onClick={toggleWalletText}
                  className="flex items-center ml-5 mt-5 bg-[#ffffff] rounded-xl cursor-pointer hover:bg-[#e7e7e7]">
                    <AiOutlineEyeInvisible className="text-black ml-4 mr-2"/>
                    <p className="text-black font-semibold mr-4">Toggle</p>
                </button>
              </div>
            </div>     
          )}
          
        </div> 
        <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
          <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
            <div className="flex justify-between flex-col w-full h-full">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-full border-2 border-white flex justify-center items-center">
                  <SiEthereum fontSize={21} color="#fff" />
                </div>
                  <BsInfoCircle fontSize={17} color="#fff" />
                </div>
              <div>
                <p className="text-white font-light text-sm">{shortenAddress(currentAccount)}</p>
                <p className="text-white font-semibold text-lg mt-1">Ethereum</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center purple-glassmorphism">
            <Input placeholder="Address To" name="addressTo" type="text" handleChange={handleChange} />
            <Input placeholder="Amount (ETH)" name="amount" type="number" handleChange={handleChange} />
            <Input placeholder="Keyword (Gif)" name="keyword" type="text" handleChange={handleChange} />
            <Input placeholder="Message" name="message" type="text" handleChange={handleChange} />

            <div className="h-[1px] w-full bg-gray-400 my-4"/>

            {isLoading ? <Loader />
              : ( <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-white w-full mt-2 border-[1px] p-2 border-[#593d7c] hover:bg-[#593d7c] rounded-2xl cursor-pointer">
                      Send Now
                  </button>
              )}
            </div>
        </div>   
      </div>
    </div>
  );
};

export default Welcome;
