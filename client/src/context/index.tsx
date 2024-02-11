import { useContext, createContext, ReactNode, useState, useEffect } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../constants/config";

interface Campaigns {
  owner: string;
  title: string;
  description: string;
  target: string;
  deadline: number | any;
  amountCollected: string;
  pId: string;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ethereum = window.ethereum;
const StateContext = createContext<Campaigns | undefined>(undefined);

const createEthereumContract = async () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionsContract;
};

export const StateContextProvider = ({ children }: { children: ReactNode }) => {
 
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);



  const checkIfWalletIsConnect = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        // getAllTransaction();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

    const connectWallet = async () => {
      try {
        if (!ethereum) return alert("Please install MetaMask.");

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("🚀 ~ connectWal ~ account:", accounts)

        setCurrentAccount(accounts[0]);
        window.location.reload();
      } catch (error) {
        console.log(error);
        throw new Error("No ethereum object");
      }
    };

  const publishCampaign = async (form:Partial<Campaigns>) => {
    try {
      // const data = await createCampaign({
const transactionsContract : any = await createEthereumContract();
       
      
      const transactionHash = await transactionsContract.createCampaign(
        currentAccount, // owner
        form.title, // title
        form.description, // description
        form.target,
       new Date(form.deadline).getTime()
      );

       setIsLoading(true);
      await transactionHash.wait();
      setIsLoading(false);

      console.log("contract call success", transactionHash);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getCampaign = async () => {
     const provider = new ethers.providers.Web3Provider(ethereum);
     const crowdfundingContract = new ethers.Contract(
       contractAddress,
       contractABI,
       provider
     );
    
    const campaigns = await crowdfundingContract.getCampaigns();

    const parsedCampaings = campaigns.map((campaign:Campaigns, i:number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: Number(campaign.deadline),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      // image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  }

  // const getUserCampaigns = async () => {
  //   const allCampaigns = await getCampaigns();

  //   const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

  //   return filteredCampaigns;
  // }

  const donate = async (pId:number, amount:string) => {
const transactionsContract: any = await createEthereumContract();

    const data = await transactionsContract.donateToCampaign(pId,
      { value: ethers.utils.parseEther(amount) }
    );

    return data;
  }

  const getDonations = async (pId) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const crowdfundingContract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    const [donators, donations] = await crowdfundingContract.getDonators(pId);
    //   const donations = await contract.call('getDonators', [pId]);
    //   const numberOfDonations = donations[0].length;

    //   const parsedDonations = [];

    //   for(let i = 0; i < numberOfDonations; i++) {
    //     parsedDonations.push({
    //       donator: donations[0][i],
    //       donation: ethers.utils.formatEther(donations[1][i].toString())
    //     })
    //   }

      return [donators, donations];
  }


    useEffect(() => {
      checkIfWalletIsConnect();
    }, []);


  return (
    <StateContext.Provider
      value={{
        currentAccount,
        //   contract,
        isLoading,
        connectWallet,
        createCampaign: publishCampaign,
        getCampaign,
        //   getUserCampaigns,
          donate,
          getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
