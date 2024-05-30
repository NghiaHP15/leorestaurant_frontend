import { useMutation } from "@tanstack/react-query";

export const userMutationHook = (fnCallback) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const mutation = useMutation({
    mutationFn: fnCallback,
  });

  return mutation;
};
