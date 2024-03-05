import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../constants/config";

interface Campaigns {
  owner?: string | any;
  title?: string;
  description?: string;
  image?: string;
  target?: string | any;
  deadline?: number | any;
  amountCollected?: any;
  pId?: string;
  currentAccount: string;
  isLoading: boolean;
  connectWallet: () => void;
  createCampaign: (form: Partial<Campaigns>) => Promise<void>;
  getCampaign: () => void;
  getUserCampaigns: () => void;
  donate: any;
  getDonations: (pId: number) => Promise<any[]>;
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
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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

    window.ethereum.on(
      "accountsChanged",
      async function (currentAccount: string) {
        setCurrentAccount(currentAccount[0]);
        await checkIfWalletIsConnect();
      }
    );
  };
  console.log(currentAccount);

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("🚀 ~ connectWal ~ account:", accounts);

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const publishCampaign = async (form: Partial<Campaigns>) => {
    try {
      const transactionsContract: any = await createEthereumContract();

      const transactionHash = await transactionsContract.createCampaign(
        currentAccount, // owner
        form.title, // title
        form.description, // description
        form.image, // image
        form.target,
        new Date(form.deadline).getTime()
      );

      setIsLoading(true);
      await transactionHash.wait();
      setIsLoading(false);
      getCampaign();

      console.log("contract call success", transactionHash);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getCampaign = async () => {
    const provider = ethereum
      ? new ethers.providers.Web3Provider(ethereum)
      : new ethers.providers.JsonRpcProvider(
          `https://sepolia.infura.io/v3/${import.meta.env.VITE_PUBLIC_RPC_URL}`
        );
    const crowdfundingContract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    const campaigns = await crowdfundingContract.getCampaigns();

    const parsedCampaings = campaigns.map((campaign: Campaigns, i: number) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      image: campaign.image,

      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: Number(campaign.deadline),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      pId: i,
    }));

    return parsedCampaings;
  };

  const getUserCampaigns = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const crowdfundingContract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    const allCampaigns = await crowdfundingContract.getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign: any) => {
      console.log("campaign.owner:", campaign.owner);
      console.log("currentAccount:", currentAccount);
    

      const checkifTrue =
        String(campaign.owner) ===
        String(currentAccount);
      const check = Boolean(checkifTrue);
      console.log("🚀 ~ filteredCampaigns ~ check:", check);
      return check;
      // return campaign.owner.toLowerCase() === currentAccount.toLowerCase();
    });

    return filteredCampaigns;
  };

  const donate = async (pId?: number, amount?: number | any) => {
    const transactionsContract: any = await createEthereumContract();

    const data = await transactionsContract.donateToCampaign(pId, {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId: number) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const crowdfundingContract = new ethers.Contract(
      contractAddress,
      contractABI,
      provider
    );

    const [donators, donations] = await crowdfundingContract.getDonators(pId);

    return [donators, donations];
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    <StateContext.Provider
      value={{
        currentAccount,
        isLoading,
        connectWallet,
        createCampaign: publishCampaign,
        getCampaign,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
