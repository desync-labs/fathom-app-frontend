import { AbiItem } from "web3-utils";
import BEP20Abi from "config/ABI/BEP20.json";
import CollateralPoolConfigAbi from "config/ABI/CollateralPoolConfig.json";
import CollateralTokenAdapterAbi from "config/ABI/CollateralTokenAdapter.json";
import DexPriceOracle from "config/ABI/DexPriceOracle.json";
import FathomStablecoinProxyActionAbi from "config/ABI/FathomStablecoinProxyActions.json";
import Governor from "config/ABI/Governor.json";
import MainToken from "config/ABI/MainToken.json";
import MainTokenGovernor from "config/ABI/MainTokenGovernor.json";
import ProxyWalletAbi from "config/ABI/ProxyWallet.json";
import ProxyWalletRegistryAbi from "config/ABI/ProxyWalletRegistry.json";
import StableSwapModule from "config/ABI/StableSwapModule.json";
import Staking from "config/ABI/Staking.json";
import StakingGetter from "config/ABI/StakingGetter.json";
import VeFathomAbi from "config/ABI/vFathom.json";

import Addresses from "config/addresses.json";


export class SmartContractFactory {
  public static Addresses(chainId: number) {
    try {
      let address: any;
      switch (chainId) {
        case 1337:
          address = Addresses["1337"];
          break;
        case 51:
          address = Addresses["51"];
          break;
        case 50:
          address = Addresses["50"];
          break;
        default:
          address = Addresses["51"];
          break;
      }
      return address;
    } catch (e) {
      console.error("Error in fetching address");
      return {};
    }
  }

  public static PoolConfig(chainId: number) {
    return {
      abi: CollateralPoolConfigAbi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).collateralPoolConfig,
    };
  }

  public static ProxyWalletRegistry(chainId: number) {
    return {
      abi: ProxyWalletRegistryAbi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).proxyWalletRegistry,
    };
  }

  public static proxyWallet = {
    abi: ProxyWalletAbi.abi as AbiItem[],
  };

  public static FathomStablecoinProxyAction(chainId: number) {
    return {
      abi: FathomStablecoinProxyActionAbi.abi as AbiItem[],
      address:
        SmartContractFactory.Addresses(chainId).fathomStablecoinProxyActions,
    };
  }

  public static WXDC(chainId: number) {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).WXDC,
    };
  }

  public static USDT(chainId: number) {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId)["US+"],
    };
  }

  public static BEP20(_address: string) {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: _address,
    };
  }

  public static FathomStableCoin(chainId: number) {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).FXD,
    };
  }

  public static PositionManager(chainId: number) {
    return {
      address: SmartContractFactory.Addresses(chainId).positionManager,
    };
  }

  public static StabilityFeeCollector(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).stabilityFeeCollector,
    };
  }

  public static StablecoinAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).stablecoinAdapter,
    };
  }

  public static FathomStablecoinProxyActions(chainId: number) {
    return {
      abi: [],
      address:
        SmartContractFactory.Addresses(chainId).fathomStablecoinProxyActions,
    };
  }

  public static StableSwapModule(chainId: number) {
    return {
      abi: StableSwapModule.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).stableSwapModule,
    };
  }

  public static FathomGovernor(chainId: number) {
    return {
      abi: Governor.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).fthmGovernor,
    };
  }

  public static MainFathomGovernor(chainId: number) {
    return {
      abi: MainTokenGovernor.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).fthmGovernor,
    };
  }

  public static Staking(chainId: number) {
    return {
      abi: Staking.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).staking,
    };
  }

  public static MainToken(fthmTokenAddress: string) {
    return {
      abi: MainToken.abi as AbiItem[],
      address: fthmTokenAddress,
    };
  }

  public static FthmToken(chainId: number) {
    return {
      abi: MainToken.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).fthmToken,
    };
  }

  public static StakingGetter(chainId: number) {
    return {
      abi: StakingGetter.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).stakingGetter, // '0x62f3d571A7DAcC00C047e58fE500ee99A98E3f63'
    };
  }

  public static vFathom(chainId: number) {
    return {
      abi: VeFathomAbi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).vFTHM,
    };
  }

  public static DexPriceOracle(chainId: number) {
    return {
      abi: DexPriceOracle.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).dexPriceOracle,
    };
  }

  public static CollateralTokenAdapterAbi() {
    return CollateralTokenAdapterAbi.abi as AbiItem[];
  }

  public static getAddressByContractName(chainId: number, name: string) {
    const Addresses = SmartContractFactory.Addresses(chainId);
    return Addresses[name];
  }
}
