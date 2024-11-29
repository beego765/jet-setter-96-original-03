import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { APITestResults } from "./APITestResults";

export const APISettings = () => {
  return (
    <div className="space-y-6">
      <APITestResults />
      
      <div className="space-y-2">
        <label className="text-sm text-gray-300">API Key</label>
        <div className="flex gap-2">
          <Input 
            defaultValue="sk_test_123456789" 
            type="password" 
            className="bg-gray-700/50 border-gray-600 text-gray-200" 
          />
          <Button variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-200">
            Regenerate
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-300">Webhook URL</label>
        <Input 
          defaultValue="https://api.opustravels.com/webhook" 
          className="bg-gray-700/50 border-gray-600 text-gray-200" 
        />
      </div>
    </div>
  );
};