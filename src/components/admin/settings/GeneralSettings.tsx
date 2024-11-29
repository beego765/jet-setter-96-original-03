import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const GeneralSettings = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Site Name</label>
        <Input defaultValue="OpusTravels Admin" className="bg-gray-700/50 border-gray-600 text-gray-200" />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Contact Email</label>
        <Input defaultValue="admin@opustravels.com" className="bg-gray-700/50 border-gray-600 text-gray-200" />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Time Zone</label>
        <Select>
          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="utc">UTC</SelectItem>
            <SelectItem value="est">EST</SelectItem>
            <SelectItem value="pst">PST</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Language</label>
        <Select>
          <SelectTrigger className="bg-gray-700/50 border-gray-600 text-gray-200">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};