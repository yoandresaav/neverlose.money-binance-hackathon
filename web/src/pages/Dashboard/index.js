import React from 'react';
import HowItWorks from './HowItWorks';
import InvestmentOverview from './InvestmentOverview';
import History from './History';
import TransactionPendingModal from 'components/TransactionPendingModal';
import BreakModal from './History/BreakModal';
import UnlockModal from './History/UnlockModal';

function Dashboard(props) {
  return (
    <div className="page-dashboard padded-horizontal">
      <HowItWorks />
      <InvestmentOverview />
      <History />
      <TransactionPendingModal />
      <BreakModal />
      <UnlockModal />
    </div>
  );
}

export default Dashboard;
