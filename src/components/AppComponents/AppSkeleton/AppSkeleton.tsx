import { Skeleton, styled } from "@mui/material";

export const CustomSkeleton = styled(Skeleton)`
  background-color: #2536564a;
`;

export const StatsValueSkeleton = () => {
  return (
    <Skeleton
      variant="rounded"
      animation={"wave"}
      width={200}
      height={28}
      sx={{ bgcolor: "#2536564a", marginTop: "7px" }}
    />
  );
};

export const AppSkeletonValue = styled(Skeleton)`
  background-color: #8ea4cc26;
`;
