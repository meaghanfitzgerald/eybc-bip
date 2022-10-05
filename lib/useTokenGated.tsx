import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { erc721ABI, useContractRead } from "wagmi";

export default function useTokenGated(
  addressOrName: string,
  required: boolean = false
) {
  const router = useRouter();
  const { status: sessionStatus, data: sessionData } = useSession();
  const address = sessionData ? (sessionData.address as string) : undefined;
  const { data: balance, isLoading: contractReadLoading } = useContractRead({
    addressOrName: addressOrName,
    contractInterface: erc721ABI,
    functionName: "balanceOf",
    args: [address],
    enabled: !!address,
    watch: true,
    onError: console.error
  });
  const isAuthenticated = sessionStatus === "authenticated";
  const isLoading = sessionStatus === "loading" || contractReadLoading;
  const hasToken = balance ? balance.gt(0) : false;

  useEffect(() => {
    if (required && router.isReady && !isLoading && !hasToken) {
      const redirect = encodeURIComponent(router.asPath);
      router.push(`/signin?redirect=${redirect}`);
    }
  }, [required, router, isLoading, hasToken]);

  return { isAuthenticated, isLoading, hasToken };
}
