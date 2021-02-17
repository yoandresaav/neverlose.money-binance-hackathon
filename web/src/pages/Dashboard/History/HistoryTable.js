import React from "react";
import emptyBox from "assets/images/empty-box.svg";
import useLockUpHistory from "hooks/useLockUpHistory";

import PacmanLoader from "react-spinners/PacmanLoader";
import HistoryTableRow from "./HistoryTableRow";
// import leftPrimary from "assets/images/left-primary.svg";
// import rightPrimary from "assets/images/right-primary.svg";

function sortHistory(a, b) {
  // put exited at at the bottom

  if (+a.exitedAt > 0 && +b.exitedAt === 0 ) return 1;
  if (+a.exitedAt === 0 && +b.exitedAt > 0) return -1;

  if (+a.exitedAt < +b.exitedAt) return 1;
  if (+a.exitedAt > +b.exitedAt) return -1;

  if (+a.startedAt.getTime() < +b.startedAt.getTime()) return 1;
  if (+a.startedAt.getTime() > +b.startedAt.getTime()) return -1;
}

function HistoryTable({ symbol }) {
  const lockups = useLockUpHistory(symbol);

  return (
    <div className="table-container top-40" cellSpacing="0" cellPadding="0">
      <table className="max-width">
        <tbody>
          <tr>
            <th colSpan="4">
              <h6>Lock-up feed</h6>
            </th>
          </tr>
          <tr className="grey mobile-hidden">
            <th>
              <p>Lock-up Date / Period</p>
            </th>
            <th>
              <p>Quantity</p>
            </th>
            <th>
              <p>Initial Price</p>
            </th>
            <th>
              <p>Action</p>
            </th>
          </tr>
          {lockups?.[symbol]?.sort(sortHistory).map((data, index) => (
            <HistoryTableRow key={index} {...data} symbol={symbol} />
          ))}
        </tbody>
      </table>

      {lockups?.[symbol]?.length === 0 && (
        <div className="top-40 bottom-100 col align-center">
          <img src={emptyBox} alt="" />
          <h6 className="top-15 light-grey">No data to show</h6>
        </div>
      )}

      {!lockups?.[symbol] && (
        <div className="top-60 bottom-100 col align-center">
          <PacmanLoader size={25} color={"#0091ff"} loading={true} />
        </div>
      )}

      {/* <div className="row justify-center top-40 bottom-40"> */}
      {/*   <img src={leftPrimary} alt="" /> */}
      {/*   <p className="grey left-20 right-20">Page 1 of 1</p> */}
      {/*   <img src={rightPrimary} alt="" /> */}
      {/* </div> */}
    </div>
  );
}

export default HistoryTable;
