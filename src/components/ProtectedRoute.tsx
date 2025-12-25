import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
};

// دالة التحقق من صلاحية التوكن (Utility Function)
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // إذا لم يكن هناك توكن أو انتهت صلاحيته، وجه المستخدم لصفحة الدخول
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token"); // تنظيف التوكن المنتهي إن وجد
    return <Navigate to="/login" replace />;
  }

  // إذا كان كل شيء سليم، اعرض المحتوى المطلوب (Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;