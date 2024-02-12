import  { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<[]>([]);

  const { currentAccount, getCampaign } = useStateContext() as any;

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaign();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
     fetchCampaigns();
  }, [currentAccount]);

  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Home