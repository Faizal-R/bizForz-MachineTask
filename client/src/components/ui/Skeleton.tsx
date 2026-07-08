import React from "react";
import { Skeleton as BoneyardSkeleton } from "boneyard-js/react";

interface SkeletonProps {
  name: string;
  loading: boolean;
  children: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ name, loading, children }) => {
  return (
    <BoneyardSkeleton name={name} loading={loading}>
      {children}
    </BoneyardSkeleton>
  );
};
