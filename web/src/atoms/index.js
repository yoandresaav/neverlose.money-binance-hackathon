import { atom } from "recoil";

export const lockUpModal = atom({
  key: "lockUpModalVisible",
  default: false,
});

export const approveModal = atom({
  key: "approveModalVisible",
  default: false,
});

export const transactionPendingModal = atom({
  key: "transactionPendingModalVisible",
  default: "",
});

export const bonusCalculatorModal = atom({
  key: "bonusCalculatorModal",
  default: null,
});

export const breakModal = atom({
  key: "breakModal",
  default: null,
});

export const unlockModal = atom({
  key: "unlockModal",
  default: null,
});

export const connectWallet = atom({
  key: "connectWallet",
  default: null,
});

export const txTimestampAtom = atom({
  key: "txTimestamp",
  default: { type: null, timestamp: null },
});

export const pendingTx = atom({
  key: "pendingTx",
  default: [],
});

export const openTx = atom({
  key: "openTx",
  default: [],
});

export const toggleDollar = atom({
  key: "toggleDollar",
  default: false,
});

export const hodlModal = atom({
  key: "hodlModal",
  default: null,
});
