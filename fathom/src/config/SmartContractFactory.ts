import { AbiItem } from "web3-utils";
import CollateralPoolConfigAbi from "config/ABI/CollateralPoolConfig.json";
import ProxyWalletRegistryAbi from "config/ABI/ProxyWalletRegistry.json";
import ProxyWalletAbi from "config/ABI/ProxyWallet.json";
import FathomStablecoinProxyActionAbi from "config/ABI/FathomStablecoinProxyActions.json";
import BEP20Abi from "config/ABI/BEP20.json";
import GetPositionsAbi from "config/ABI/GetPositions.json";
import StableSwapModule from "config/ABI/StableSwapModule.json";
import Addresses from "config/addresses.json";
import Staking from "config/ABI/Staking.json";
import StakingGetter from "config/ABI/StakingGetter.json";
import MainToken from "config/ABI/MainToken.json";
import VeMainToken from "config/ABI/VeMainToken.json";
import Token from "config/ABI/Token.json";
import FathomStats from "config/ABI/FathomStats.json";
import Governor from "config/ABI/Governor.json";
import VeFathomAbi from "config/ABI/VeFathom.json";
import DexPriceOracle from "config/ABI/DexPriceOracle.json";

export class SmartContractFactory {
  public static Addresses(chainId: number) {
    try {
      let address: any;
      switch (chainId) {
        case 1337:
          address = Addresses["1337"];
          break;
        case 5:
          address = Addresses["5"];
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
      console.error(`Error in fetching address`);
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
    address: "",
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
      address: SmartContractFactory.Addresses(chainId).USDT,
    };
  }

  public static FTHMToken(chainId: number) {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).fathomToken,
    };
  }

  public static BEP20 = (_address: string) => {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: _address,
    };
  };

  public static FathomStableCoin(chainId: number) {
    return {
      abi: BEP20Abi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).FXD,
    };
  }

  public static PositionManager(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).positionManager,
    };
  }

  public static StabilityFeeCollector(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).stabilityFeeCollector,
    };
  }

  public static WXDCCollateralTokenAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).collateralTokenAdapter,
    };
  }

  public static USDTCollateralTokenAdapter(chainId: number) {
    return {
      abi: [],
      address:
        SmartContractFactory.Addresses(chainId).collateralTokenAdapterUSDT,
    };
  }

  public static FTHMCollateralTokenAdapter(chainId: number) {
    return {
      abi: [],
      address:
        SmartContractFactory.Addresses(chainId).collateralTokenAdapterFTHM,
    };
  }

  public static StablecoinAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).stablecoinAdapter,
    };
  }

  public static AuthtokenAdapter(chainId: number) {
    return {
      abi: [],
      address: SmartContractFactory.Addresses(chainId).authTokenAdapter,
    };
  }

  public static FathomStablecoinProxyActions(chainId: number) {
    return {
      abi: [],
      address:
        SmartContractFactory.Addresses(chainId).fathomStablecoinProxyActions,
    };
  }

  public static GetPositions(chainId: number) {
    return {
      abi: GetPositionsAbi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).getPositions,
    };
  }

  public static StableSwapModule(chainId: number) {
    return {
      abi: StableSwapModule.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).stableSwapModule,
    };
  }

  public static FathomStats(chainId: number) {
    return {
      abi: FathomStats.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).fathomStats,
    };
  }

  public static FathomGovernor(chainId: number) {
    return {
      abi: Governor.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).fathomGovernor,
    };
  }
  public static Staking(chainId: number) {
    return {
      abi: Staking.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).staking,
    };
  }

  public static MainToken(chainId: number) {
    return {
      abi: MainToken.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).mainToken, // '0x62f3d571A7DAcC00C047e58fE500ee99A98E3f63'
    };
  }

  public static StakingGetter(chainId: number) {
    return {
      abi: StakingGetter.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).stakingGetter, // '0x62f3d571A7DAcC00C047e58fE500ee99A98E3f63'
    };
  }

  public static VeMAINToken(chainId: number) {
    return {
      abi: VeMainToken.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).veMainToken, // '0x62f3d571A7DAcC00C047e58fE500ee99A98E3f63'
    };
  }

  public static StreamRewardToken(chainId: number) {
    return {
      abi: Token.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).streamRewardToken, // '0x62f3d571A7DAcC00C047e58fE500ee99A98E3f63'
    };
  }

  public static VeFathom(chainId: number) {
    return {
      abi: VeFathomAbi.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).veFTHM,
    };
  }

  public static DexPriceOracle(chainId: number) {
    return {
      abi: DexPriceOracle.abi as AbiItem[],
      address: SmartContractFactory.Addresses(chainId).dexPriceOracle,
    };
  }

  public static getAddressByContractName(chainId: number, name: string) {
    const Addresses = SmartContractFactory.Addresses(chainId);
    return Addresses[name];
  }
}
