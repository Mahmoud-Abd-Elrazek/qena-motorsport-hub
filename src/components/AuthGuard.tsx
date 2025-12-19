import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

type JwtPayload = {
  exp: number;
};

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        toast.error("انتهت صلاحية الجلسة");
        navigate("/admin", { replace: true });
      }
    } catch {
      localStorage.removeItem("token");
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
