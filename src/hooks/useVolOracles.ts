import useProvider from "./useProvider";
import VolOracleABI from "../abis/VolOracle.json";
import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";

const VOL_ORACLE = "0x8eB47e59E0C03A7D1BFeaFEe6b85910Cefd0ee99";
const USDCETH_POOL = "0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8";
const WBTCUSDC_POOL = "0x99ac8cA7087fA4A2A1FB6357269965A2014ABc35";
const pools = [USDCETH_POOL, WBTCUSDC_POOL] as const;
export type Pools = typeof pools[number];

interface OracleData {
  annualizedVol: BigNumber;
  lastTWAP: BigNumber;
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
    },
    [WBTCUSDC_POOL]: {
      annualizedVol: BigNumber.from(0),
      lastTWAP: BigNumber.from(0),
    },
  });

  useEffect(() => {
    (async () => {
      let oraclesCopy = {
        [USDCETH_POOL]: {
          annualizedVol: BigNumber.from(0),
          lastTWAP: BigNumber.from(0),
        },
        [WBTCUSDC_POOL]: {
          annualizedVol: BigNumber.from(0),
          lastTWAP: BigNumber.from(0),
        },
      };
      for (let i = 0; i < pools.length; i++) {
        const pool = pools[i];
        const promises = [oracle.annualizedVol(pool), oracle.lastPrices(pool)];
        const [annualizedVol, lastTWAP] = await Promise.all(promises);
        oraclesCopy[pool] = { annualizedVol, lastTWAP };
      }
      setOracles(oraclesCopy);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return oracles;
};
export default useVolOracles;
