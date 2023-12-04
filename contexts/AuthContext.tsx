"use client";
import { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { serverLogin } from "@/actions/login-actions";
import { serverLogout } from "@/actions/logout-action";
import { getUserInfoOnRefresh } from "@/actions/page-refresh-action";
import Loading from "@/components/Loading";

type UserInfo = {
  id: number;
  email: string;
};

interface AuthContextInterface {
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | undefined>>;
  userInfo: UserInfo | undefined;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
}

const defaultState = {
  userInfo: undefined,
  setUserInfo: (userInfo: UserInfo) => {},
  login: (email: string, password: string) => {},
  logout: () => {},
} as AuthContextInterface;

export const AuthContext = createContext<AuthContextInterface>(defaultState);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await getUserInfoOnRefresh();

      if ("error" in response) {
        toast.error(response.error);
        router.replace("/login");
      } else {
        setUserInfo(response.data);
      }
    };
    if (pathname != "/login") {
      setLoading(true);
      fetchUserInfo();
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    const success = await serverLogout();
    if (success) {
      setUserInfo(undefined);
      toast.success("You have been logged out");
      router.push("/login");
    } else {
      toast.error("Something went wrong");
    }
  };

  const login = async (email: string, password: string) => {
    const result = await serverLogin(email, password);
    if (result?.error) {
      toast.error(result.error);
    } else {
      const data: UserInfo | undefined = result.data;
      setUserInfo(data);
      router.push("/");
    }
  };

  const values: AuthContextInterface = {
    userInfo,
    setUserInfo,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={values}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
}
