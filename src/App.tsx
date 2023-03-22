import React, { useEffect, useState } from "react";
import "./App.css";
import Lottery from "./assets/Lottery.json";
import LotteryToken from "./assets/LotteryToken.json";
import { ethers, Signer } from "ethers";

function App() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [lotteryContract, setLotteryContract] = useState<ethers.Contract>();

  const [userAccount, setUserAccount] = useState<string>();
  const [amount, setAmount] = useState<string>();
  const [betDuration, setBetDuration] = useState<string>();
  const [bettingStatus, setBettingStatus] = useState<boolean>();

  useEffect(() => {
    // setting the provider
    // setProvider(
    //   new ethers.providers.AlchemyProvider(
    //     "goerli",
    //     "1E_pcdnYEZZvvHaBnHEeUyzTzTh-pdfd"
    //   )
    // );
    const { ethereum } = window as any;
    const provider = new ethers.providers.Web3Provider(ethereum);
    setProvider(provider);

    // setting the Lottery contract
    setLotteryContract(
      new ethers.Contract(
        "0x9253e339508962B1070Fc4E6B05187260F21fc03",
        Lottery.abi,
        provider
      )
    );
  }, []);

  const connectWallet = async () => {
    const { ethereum } = window as any;
    if (!ethereum) {
      alert("Get MetaMask!");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected", accounts[0]);
    setUserAccount(accounts[0]);
    // const { ethereum } = window as any;
    // const provider = new ethers.providers.Web3Provider(ethereum);
    // const account = await provider.getSigner().getAddress();
    // setUserAccount(account);
  };

  const checkStatus = async () => {
    console.log("Checking status...");
    const state = await lotteryContract?.betsOpen();
    setBettingStatus(state);
    console.log(`The lottery is ${state ? "open" : "closed"}\n`);

    if (!state) return;
    const currentBlock = await provider?.getBlock("latest");

    // It was originally currentBlock?.timestamp
    const currentBlockDate = new Date((currentBlock?.timestamp || 1000) * 1000);
    const closingTime = await lotteryContract?.betsClosingTime();
    const closingTimeDate = new Date(closingTime.toNumber() * 1000);
    console.log(
      `The last block was mined at ${currentBlockDate.toLocaleDateString()} : ${currentBlockDate.toLocaleTimeString()}\n`
    );

    console.log(
      `lottery should close at ${closingTimeDate.toLocaleDateString()} : ${closingTimeDate.toLocaleTimeString()}\n`
    );
  };

  const buyTokens = async (e: any) => {
    e.preventDefault();

    const { ethereum } = window as any;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const tx = await lotteryContract?.connect(signer).purchaseTokens({
      value: ethers.utils.parseEther(amount || "").div(10),
    });
    const receipt = await tx.wait();
    console.log(`Tokens bought (${receipt.transactionHash})\n`);
  };

  const betTokens = async (e: any) => {
    e.preventDefault();
  };
  const burnTokens = async (e: any) => {
    e.preventDefault();
  };

  const openBets = async (e: any) => {
    e.preventDefault();

    const currentBlock = await provider?.getBlock("latest");
    console.log("Current timestamp ",(currentBlock?.timestamp || 0));
    console.log("Total duration ",(await currentBlock?.timestamp || 0 + 100));
    
    // const { ethereum } = window as any;
    // const provider = new ethers.providers.Web3Provider(ethereum);
    // const signer = provider.getSigner();

    // const tx = await lotteryContract
    //   ?.connect(signer)
    //   .openBets(1679335900);
    // const receipt = await tx.wait();
    // console.log(`Bets opened (${receipt.transactionHash})`);
  };

  return (
    <div className="App">
      <div className="flex justify-center space-x-2 mt-6">
        <button
          onClick={connectWallet}
          type="button"
          className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
        >
          {userAccount ? "Wallet Connected" : "Connect Wallet"}
        </button>
      </div>
      {userAccount && (
        <div className="">
          <div className="justify-center flex gap-4 w-full my-6">
            <button
              onClick={checkStatus}
              className="inline-block rounded-md bg-red-500 px-6 py-2 font-semibold text-green-100 shadow-md duration-75 hover:bg-red-400"
            >
              Close Bet
            </button>
            <button
              onClick={checkStatus}
              className="inline-block rounded-md bg-green-500 px-6 py-2 font-semibold text-green-100 shadow-md duration-75 hover:bg-green-400"
            >
              Display Winner
            </button>
          </div>
          <div className="flex justify-center">
            <div className=" m-3 my-6 w-full p-4 max-w-sm overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-xl">
              <h1 className="mt-2 text-center text-2xl font-bold text-gray-500">
                Betting Status
              </h1>
              <p className="my-6 text-center text-sm text-gray-500">
                {bettingStatus === true ? "Open" : "Lottery is closed"}
              </p>
              <div className="space-x-4 py-4 text-right">
                <button
                  onClick={checkStatus}
                  className="inline-block rounded-md bg-green-500 px-6 py-2 font-semibold text-green-100 shadow-md duration-75 hover:bg-green-400"
                >
                  Check Status
                </button>
              </div>
            </div>
            <div className="m-3 my-6 w-full p-4 max-w-sm overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-xl">
              <h1 className="mt-2 text-center text-2xl font-bold text-gray-500">
                Open Bets
              </h1>
              <form action="">
                <p className="my-4 text-center text-sm text-gray-500">
                  <input
                    className="border w-full p-2 rounded-lg"
                    type="text"
                    placeholder="Bet Duration"
                    onChange={(e) => setBetDuration(e.target.value)}
                  />
                </p>
                <div className="space-x-4 py-4 text-right">
                  <button
                    onClick={openBets}
                    className="inline-block rounded-md bg-purple-500 px-6 py-2 font-semibold text-green-100 shadow-md duration-75 hover:bg-purple-400"
                  >
                    Open Bet
                  </button>
                </div>
              </form>
            </div>
            <div className="m-3 my-6 w-full p-4 max-w-sm overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-xl">
              <h1 className="mt-2 text-center text-2xl font-bold text-gray-500">
                Buy Token
              </h1>
              <form action="">
                <p className="my-4 text-center text-sm text-gray-500">
                  <input
                    className="border w-full p-2 rounded-lg"
                    type="text"
                    placeholder="Enter Amount"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </p>
                <div className="space-x-4 py-4 text-right">
                  <button
                    onClick={buyTokens}
                    className="inline-block rounded-md bg-yellow-500 px-6 py-2 font-semibold text-green-100 shadow-md duration-75 hover:bg-yellow-400"
                  >
                    Buy Tokens
                  </button>
                </div>
              </form>
            </div>
            <div className=" m-3 my-6 w-full p-4 max-w-sm overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-xl">
              <h1 className="mt-2 text-center text-2xl font-bold text-gray-500">
                Bet Token
              </h1>
              <form action="">
                <p className="my-4 text-center text-sm text-gray-500">
                  <input
                    className="border w-full p-2 rounded-lg"
                    type="text"
                    placeholder="Enter Amount"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </p>
                <div className="space-x-4 py-4 text-right">
                  <button
                    onClick={betTokens}
                    className="inline-block rounded-md bg-orange-500 px-6 py-2 font-semibold text-green-100 shadow-md duration-75 hover:bg-orange-400"
                  >
                    Bet Tokens
                  </button>
                </div>
              </form>
            </div>
            <div className=" m-3 my-6 w-full p-4 max-w-sm overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-xl">
              <h1 className="mt-2 text-center text-2xl font-bold text-gray-500">
                Burn Token
              </h1>
              <form action="">
                <p className="my-4 text-center text-sm text-gray-500">
                  <input
                    className="border w-full p-2 rounded-lg"
                    type="text"
                    placeholder="Enter Amount"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </p>
                <div className="space-x-4 py-4 text-right">
                  <button
                    onClick={burnTokens}
                    className="inline-block rounded-md bg-red-500 px-6 py-2 font-semibold text-green-100 shadow-md duration-75 hover:bg-red-400"
                  >
                    Burn Tokens
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
