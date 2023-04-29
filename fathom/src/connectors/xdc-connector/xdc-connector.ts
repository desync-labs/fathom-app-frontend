import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'

import { SendReturnResult, SendReturn, Send, SendOld } from './types'

function parseSendReturn(sendReturn: SendReturnResult | SendReturn): any {
  return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
}

export class NoXdcPayProviderError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No Xdc provider was found on window.xdc.'
  }
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export class XdcInjectedConnector extends AbstractConnector {
  constructor(kwargs: AbstractConnectorArguments) {
    super(kwargs)

    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  private handleChainChanged(chainId: string | number): void {
    this.emitUpdate({ chainId, provider: window.xdc })
  }

  private handleAccountsChanged(accounts: string[]): void {
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }

  private handleClose(code: number, reason: string): void {
    this.emitDeactivate()
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!window.xdc) {
      throw new NoXdcPayProviderError()
    }

    if (window.xdc.on) {
      window.xdc.on('chainChanged', this.handleChainChanged)
      window.xdc.on('accountsChanged', this.handleAccountsChanged)
      window.xdc.on('close', this.handleClose)
    }

    if ((window.xdc)) {
      ;(window.xdc as any).autoRefreshOnNetworkChange = false
    }

    // try to activate + get account via eth_requestAccounts
    let account
    try {
      account = await (window.xdc.send as Send)('eth_requestAccounts').then(
        sendReturn => parseSendReturn(sendReturn)[0]
      )
    } catch (error) {
      if ((error as any).code === 4001) {
        throw new UserRejectedRequestError()
      }
      warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable')
    }

    // if unsuccessful, try enable
    if (!account) {
      // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
      account = await window.xdc.enable().then(sendReturn => sendReturn && parseSendReturn(sendReturn)[0])
    }

    return { provider: window.xdc, ...(account ? { account } : {}) }
  }

  public async getProvider(): Promise<any> {
    return window.xdc
  }

  public async getChainId(): Promise<number | string> {
    if (!window.xdc) {
      throw new NoXdcPayProviderError()
    }

    let chainId
    try {
      chainId = await (window.xdc.send as Send)('eth_chainId').then(parseSendReturn)
    } catch {
      warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
    }

    if (!chainId) {
      try {
        chainId = await (window.xdc?.send as Send)('net_version').then(parseSendReturn)
      } catch {
        warning(false, 'net_version was unsuccessful, falling back to net version v2')
      }
    }

    if (!chainId) {
      try {
        chainId = parseSendReturn((window.xdc.send as SendOld)({ method: 'net_version' }))
      } catch {
        warning(false, 'net_version v2 was unsuccessful, falling back to manual matches and static properties')
      }
    }

    if (!chainId) {
      if ((window.xdc as any).isDapper) {
        chainId = parseSendReturn((window.xdc as any).cachedResults.net_version)
      } else {
        chainId =
          (window.xdc as any).chainId ||
          (window.xdc as any).netVersion ||
          (window.xdc as any).networkVersion ||
          (window.xdc as any)._chainId
      }
    }

    return chainId
  }

  public async getAccount(): Promise<null | string> {
    if (!window.xdc) {
      throw new NoXdcPayProviderError()
    }

    let account
    try {
      account = await (window.xdc.send as Send)('eth_accounts').then(sendReturn => parseSendReturn(sendReturn)[0])
    } catch {
      warning(false, 'eth_accounts was unsuccessful, falling back to enable')
    }

    if (!account) {
      try {
        account = await window.xdc.enable().then(sendReturn => parseSendReturn(sendReturn)[0])
      } catch {
        warning(false, 'enable was unsuccessful, falling back to eth_accounts v2')
      }
    }

    if (!account) {
      account = parseSendReturn((window.xdc.send as SendOld)({ method: 'eth_accounts' }))[0]
    }

    return account
  }

  public deactivate() {
    if (window.xdc && window.xdc.removeListener) {
      window.xdc.removeListener('chainChanged', this.handleChainChanged)
      window.xdc.removeListener('accountsChanged', this.handleAccountsChanged)
      window.xdc.removeListener('close', this.handleClose)
    }
  }

  public async isAuthorized(): Promise<boolean> {
    if (!window.xdc) {
      return false
    }

    try {
      return await (window.xdc.send as Send)('eth_accounts').then(sendReturn => {
        if (parseSendReturn(sendReturn).length > 0) {
          return true
        } else {
          return false
        }
      })
    } catch {
      return false
    }
  }
}