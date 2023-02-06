/// <reference types="react-scripts" />
declare module 'web3/dist/web3.min.js'


interface Window {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => void
    on?: (...args: any[]) => void
    removeListener?: (...args: any[]) => void
    autoRefreshOnNetworkChange?: boolean
  }
  web3?: {}
}