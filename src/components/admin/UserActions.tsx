import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

export const UserActions = () => {
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white">
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button>
      <Button variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-200 hover:text-white">
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    </div>
  );
};