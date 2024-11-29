import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GeneralSettings } from "./settings/GeneralSettings";
import { PreferencesSettings } from "./settings/PreferencesSettings";
import { APISettings } from "./settings/APISettings";

export const SettingsTab = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">General Settings</h2>
        <GeneralSettings />
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">Preferences</h2>
        <PreferencesSettings />
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-6">API Settings</h2>
        <APISettings />
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" className="border-gray-600 hover:bg-gray-700 text-gray-200">
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};