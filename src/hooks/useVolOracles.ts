import useProvider from "./useProvider";
import VolOracleABI from "../abis/VolOracle.json";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import ETH_ICON from "../img/eth.png";
import BTC_ICON from "../img/btc.png";

const VOL_ORACLE = "0x4df938e57fD4Ad1dFDdDEEb1B4cFAbAB19E33A0E";
export const USDCETH_POOL = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";
export const WBTCUSDC_POOL = "0x99ac8cA7087fA4A2A1FB6357269965A2014ABc35";
export const pools = [USDCETH_POOL, WBTCUSDC_POOL] as const;
export type Pools = typeof pools[number];

export const ORACLE_METADATA = {
  [USDCETH_POOL]: {
    name: "USDC/ETH Pool",
    decimals: 18,
    underlying: "ETH",
    quoteAsset: "ETH",
    icon: ETH_ICON,
  },
  [WBTCUSDC_POOL]: {
    name: "WBTC/USDC Pool",
    decimals: 6,
    underlying: "WBTC",
    quoteAsset: "USDC",
    icon: BTC_ICON,
  },
};

interface OracleData {
  annualizedVol: BigNumber;
  lastTWAP: BigNumber;
  lastUpdateTimestamp: number;
}

const useVolOracles = () => {
  const provider = useProvider();
  const oracle = new ethers.Contract(VOL_ORACLE, VolOracleABI, provider);

  const [oracles, setOracles] = useState<
    {
      [pool in Pools]: OracleData;
    }
  >({
    [USDCETH_POOL]: {
      annualizedVol: BigNumber.from(0),
      lastTWAP: BigNumber.from(0),
      lastUpdateTimestamp: 0,
    },
    [WBTCUSDC_POOL]: {
      annualizedVol: BigNumber.from(0),
      lastTWAP: BigNumber.from(0),
      lastUpdateTimestamp: 0,
    },
  });

  useEffect(() => {
    (async () => {
      let oraclesCopy = {
        [USDCETH_POOL]: {
          annualizedVol: BigNumber.from(0),
          lastTWAP: BigNumber.from(0),
          lastUpdateTimestamp: 0,
        },
        [WBTCUSDC_POOL]: {
          annualizedVol: BigNumber.from(0),
          lastTWAP: BigNumber.from(0),
          lastUpdateTimestamp: 0,
        },
      };
      for (let i = 0; i < pools.length; i++) {
        const pool = pools[i];
        const promises = [
          oracle.annualizedVol(pool),
          oracle.lastPrices(pool),
          oracle.accumulators(pool),
        ];
        const [annualizedVol, lastTWAP, accumulator] = await Promise.all(
          promises
        );
        const lastUpdateTimestamp = accumulator.lastTimestamp;
        oraclesCopy[pool] = { annualizedVol, lastTWAP, lastUpdateTimestamp };
      }
      setOracles(oraclesCopy);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return oracles;
};
export default useVolOracles;
