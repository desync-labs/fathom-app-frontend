import { TitleSecondary } from "../AppComponents/AppBox/AppBox";
import * as React from "react";
import { FC } from "react";
import StreamItem from "components/Staking/StreamItem";

// <TableContainer sx={{ my: 2 }}>
//   <Table sx={{ minWidth: 650 }} aria-label="simple table">
//     <TableHead>
//       <AppTableHeaderRow>
//         <TableCell component="th">Lock Position</TableCell>
//         <TableCell component="th">Vote Tokens Received</TableCell>
//         <TableCell component="th">Stream Rewards</TableCell>
//         <TableCell component="th">Remaining Period</TableCell>
//         <TableCell component="th">Unlock</TableCell>
//         <TableCell component="th">Early Unlock</TableCell>
//       </AppTableHeaderRow>
//     </TableHead>
//     <TableBody>
//       {isLoading ? (
//         <TableRow>
//           <TableCell align="center" colSpan={6}>
//             <CircularProgress />
//           </TableCell>
//         </TableRow>
//       ) : (
//         stakingStore.lockPositions.map((lockPosition: ILockPosition) => (
//           <StakingViewItem
//             key={lockPosition.lockId}
//             lockPosition={lockPosition}
//             action={action}
//             {...stakingViewItemProps}
//           />
//         ))
//       )}
//     </TableBody>
//   </Table>
// </TableContainer>

// <Button variant="outlined" onClick={claimRewards} sx={{ my: 2 }}>
//   {action?.type === "claim" ? (
//     <CircularProgress size={30} />
//   ) : (
//     "Claim Stream Rewards"
//   )}
// </Button>
// <Button variant="outlined" onClick={withdrawRewards}>
//   {action?.type === "withdraw" ? (
//     <CircularProgress size={30} />
//   ) : (
//     "Withdraw All Rewards and Remaining Unlocked FTHM"
//   )}
// </Button>

const StakingPositions: FC = () => {
  return (
    <>
      <TitleSecondary>My Positions</TitleSecondary>
      <StreamItem />
      <StreamItem />
    </>
  );
};

export default StakingPositions;
