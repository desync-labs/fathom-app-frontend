import { WalletBalanceProvider } from "@aave/contract-helpers";
import { Provider } from "@ethersproject/providers";
import { Hashable } from "src/utils/types";

type GetPoolWalletBalances = {
  user: string;
  lendingPoolAddressProvider: string;
};

type UserPoolTokensBalances = {
  address: string;
  amount: string;
};

export class WalletBalanceService implements Hashable {
  private readonly walletBalanceService: WalletBalanceProvider;

  constructor(
    provider: Provider,
    walletBalanceProviderAddress: string,
    public readonly chainId: number
  ) {
    this.walletBalanceService = new WalletBalanceProvider({
      walletBalanceProviderAddress,
      provider,
    });
  }

  async getPoolTokensBalances({
    user,
    lendingPoolAddressProvider,
  }: GetPoolWalletBalances): Promise<UserPoolTokensBalances[]> {
    const { 0: tokenAddresses, 1: balances } =
      await this.walletBalanceService.getUserWalletBalancesForLendingPoolProvider(
        user,
        lendingPoolAddressProvider
      );
    const mappedBalances = tokenAddresses.map((address, ix) => ({
      address: address.toLowerCase(),
      amount: balances[ix].toString(),
    }));
    return mappedBalances;
  }

  public toHash() {
    return this.chainId.toString();
  }
}
