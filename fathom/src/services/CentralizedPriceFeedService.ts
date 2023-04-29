import ICentralizedPriceFeedService from "services/interfaces/ICentralizedPriceFeedService";
import { CRYPTOCOMPARE_ENDPOINT } from "helpers/Constants";


export default class CentralizedPriceFeedService implements ICentralizedPriceFeedService {
  cryptocompareConvertXdcUsdt(): Promise<any> {
    return fetch(`${CRYPTOCOMPARE_ENDPOINT}?fsym=XDC&tsyms=USDT`)
      .then((response) => response.json())
      .then((data) => data);
  }
}