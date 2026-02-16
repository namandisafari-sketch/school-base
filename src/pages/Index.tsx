import { Navigate } from "react-router-dom";
import { useSchool } from "@/contexts/SchoolContext";

const Index = () => {
  const { isSetupComplete } = useSchool();
  return <Navigate to={isSetupComplete ? "/dashboard" : "/setup"} replace />;
};

export default Index;
