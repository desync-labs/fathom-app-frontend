import {XDC_CHAIN_IDS} from "connectors/networks";

const ETHERSCAN_PREFIXES: { [chainId in number]: string } = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
  50: 'xdc.',
  51: 'apothem.'
}

export function getEtherscanLink(
  chainId: number,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  let prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

  if (XDC_CHAIN_IDS.includes(chainId)) {
    prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}blocksscan.io`
  }

  if (XDC_CHAIN_IDS.includes(chainId)) {
    switch (type) {
      case 'transaction': {
        return `${prefix}/txs/${data}`
      }
      case 'token': {
        return `${prefix}/tokens/${data}`
      }
      case 'block': {
        return `${prefix}/blocks/${data}`
      }
      case 'address':
      default: {
        return `${prefix}/address/${data}`
      }
    }
  } else {
    switch (type) {
      case 'transaction': {
        return `${prefix}/tx/${data}`
      }
      case 'token': {
        return `${prefix}/token/${data}`
      }
      case 'block': {
        return `${prefix}/block/${data}`
      }
      case 'address':
      default: {
        return `${prefix}/address/${data}`
      }
    }
  }
}