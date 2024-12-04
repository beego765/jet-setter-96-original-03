import { useLocation } from "react-router-dom";
import { SearchFormData } from "@/components/flight-search/SearchForm";
import { Card } from "@/components/ui/card";

const Search = () => {
  const location = useLocation();
  const searchData = location.state?.searchData as SearchFormData;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Flight Search Results</h1>
      <Card className="p-6">
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(searchData, null, 2)}
        </pre>
      </Card>
    </div>
  );
};

export default Search;