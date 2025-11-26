import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('../pages/home/page'));
const NotFound = lazy(() => import('../pages/NotFound'));
const HairyTools = lazy(() => import('../pages/hairy-tools/page'));
const AutomationDashboard = lazy(() => import('../pages/automation-dashboard/page'));
const GlobalDashboard = lazy(() => import('../pages/global-dashboard/page'));
const HairyHome = lazy(() => import('../pages/hairy-home/page'));
const Wallet = lazy(() => import('../pages/wallet/page'));
const WalletLogin = lazy(() => import('../pages/wallet-login/page'));
const WalletRegister = lazy(() => import('../pages/wallet-register/page'));
const DownloadWallet = lazy(() => import('../pages/download-wallet/page'));
const HairyWallet = lazy(() => import('../pages/hairy-wallet/page'));
const HairyWalletCrear = lazy(() => import('../pages/hairy-wallet-crear/page'));
const HairyWalletImportar = lazy(() => import('../pages/hairy-wallet-importar/page'));
const HairyWalletEnviar = lazy(() => import('../pages/hairy-wallet-enviar/page'));
const HairyWalletRecibir = lazy(() => import('../pages/hairy-wallet-recibir/page'));
const HairyWalletHistorial = lazy(() => import('../pages/hairy-wallet-historial/page'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/hairy-tools',
    element: <HairyTools />,
  },
  {
    path: '/automation-dashboard',
    element: <AutomationDashboard />,
  },
  {
    path: '/global-dashboard',
    element: <GlobalDashboard />,
  },
  {
    path: '/hairy-home',
    element: <HairyHome />,
  },
  {
    path: '/wallet',
    element: <Wallet />,
  },
  {
    path: '/wallet/login',
    element: <WalletLogin />,
  },
  {
    path: '/wallet/registro',
    element: <WalletRegister />,
  },
  {
    path: '/descargar-wallet',
    element: <DownloadWallet />,
  },
  {
    path: '/hairy-wallet',
    element: <HairyWallet />,
  },
  {
    path: '/hairy-wallet/crear',
    element: <HairyWalletCrear />,
  },
  {
    path: '/hairy-wallet/importar',
    element: <HairyWalletImportar />,
  },
  {
    path: '/hairy-wallet/enviar',
    element: <HairyWalletEnviar />,
  },
  {
    path: '/hairy-wallet/recibir',
    element: <HairyWalletRecibir />,
  },
  {
    path: '/hairy-wallet/historial',
    element: <HairyWalletHistorial />,
  },
  {
    path: '/wallet-login',
    element: lazy(() => import('../pages/wallet-login/page')),
  },
  {
    path: '/wallet-register',
    element: lazy(() => import('../pages/wallet-register/page')),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
