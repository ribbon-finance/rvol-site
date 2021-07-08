import { ethers } from "ethers";

const useProvider = () => {
  return ethers.getDefaultProvider(process.env.REACT_APP_MAINNET_URI);
};
export default useProvider;
