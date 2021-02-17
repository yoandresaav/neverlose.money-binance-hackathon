import { toast } from "react-toastify";
import ERRORS from "constants/errors";

const RPC_ERROR_CODE = -32603;
const TX_REJECTED_CODE = 4001;

const UNEXPECTED_ERROR_CODES = [
  "POOL_NOT_FOUND",
  "INVALID_TOKEN",
  "POOL_ALREADY_EXISTS",
  "INVALID_AMOUNT",
  "INVALID_DURATION",
  "MUST_BE_FORCED",
  "MUST_NOT_BE_FORCED",
];

export function handleErrorMessage(e, type = "error") {
  if (typeof e === "string") {
    toast[type](e);
    return;
  }

  if (e?.code === RPC_ERROR_CODE) {
    toast.error(
      "Transaction failed to broadcast. Please try again with a proper gas price and limit settings."
    );
  } else if (e?.code === TX_REJECTED_CODE) {
    toast.error("User rejected transaction signature on Metamask.");
  } else {
    const message = e?.error?.message || e?.message || e?.name;
    const errorCode = message?.split("execution reverted: ")?.[1];

    let toastMessage = `${message}`;

    if (UNEXPECTED_ERROR_CODES.includes(errorCode)) {
      toastMessage = `There was an error with transaction. Please contact the team via admin@hunt.town with this error message: ${errorCode}`;
    } else if (errorCode === "SafeERC20: low-level call failed") {
      toastMessage =
        "You have insufficient balance or allowance to perform this action.";
    } else if (errorCode) {
      toastMessage = ERRORS[errorCode];
    }

    toast[type](toastMessage);
  }
}
