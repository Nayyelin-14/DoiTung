import {
  Accountremove,
  getallusers,
  GetCertificate,
  Unrestrict_user,
  userrestriction,
} from "@/EndPoints/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useManageUser = (userid) => {
  // console.log(userid);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryFn: getallusers,
    queryKey: ["users"],
    staleTime: Infinity,
  });

  const { mutate: restrictUser } = useMutation({
    mutationFn: (userid) => userrestriction(userid),
    onSuccess: (data) => {
      toast.info(data.message);
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.message || "Restriction Failed");
    },
  });
  const { mutate: unrestrictUser } = useMutation({
    mutationFn: (userid) => Unrestrict_user(userid),
    onSuccess: (data) => {
      toast.info(data.message);
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.message || "Restriction Failed");
    },
  });
  const { mutate: removeUser } = useMutation({
    mutationFn: (userid) => Accountremove(userid),
    onSuccess: (data) => {
      toast.info(data.message);
      queryClient.invalidateQueries(["users"]);
    },
    onError: (error) => {
      toast.error(error.message || "Restriction Failed");
    },
  });
  const users = data?.allusers ?? [];

  return {
    users,
    isLoading,
    restrictUser,
    unrestrictUser,
    removeUser,
  };
};
