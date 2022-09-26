import { InjectedConnector } from '@web3-react/injected-connector'

const supportedChainIds = [5, 1337];

export const injected = new InjectedConnector({ supportedChainIds })