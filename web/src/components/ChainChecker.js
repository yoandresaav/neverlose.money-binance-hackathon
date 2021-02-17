import { useRef, useEffect } from "react";
import { allowedChainId } from "utils/chainId";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";

function ChainChecker(props) {
  const { chainId } = useWeb3React();
  const prev = useRef();

  useEffect(() => {
    if (prev.current !== chainId && !allowedChainId(chainId)) {
      toast.warn(
        "Seems like you're not on the right network. Please double check if you're on the correct chain."
      );
      prev.current = chainId;
    }
  }, [chainId]);

  return null;
}

export default ChainChecker;
