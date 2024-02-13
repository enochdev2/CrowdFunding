import withdraw  from '../assets/withdraw.svg';
// import profile  from '../assets/profile.svg';
import payment  from '../assets/payment.svg';
import logout from '../assets/logout.svg';
import dashboard from '../assets/dashboard.svg';
import createCampaign from '../assets/create-campaign.svg';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'campaign',
    imgUrl: createCampaign,
    link: '/create-campaign',
  },
  {
    name: 'payment',
    imgUrl: payment,
    link: '/',
    disabled: true,
  },
  {
    name: 'withdraw',
    imgUrl: withdraw,
    link: '/',
    disabled: true,
  },
  // {
  //   name: 'profile',
  //   imgUrl: profile,
  //   link: '/profile',
  // },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/',
    disabled: true,
  },
];
