import { SearchWizard } from "@/components/search/SearchWizard";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();

  return <SearchWizard onClose={() => navigate("/")} />;
}
