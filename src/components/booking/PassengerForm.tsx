import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PassengerFormProps {
  index: number;
  type: string;
  onChange: (index: number, data: any) => void;
  initialData?: any;
}

export const PassengerForm = ({ index, type, onChange, initialData }: PassengerFormProps) => {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onChange(index, { [field]: value });
  };

  return (
    <Card className="p-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Passenger {index + 1} ({type})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Select 
              value={formData.title} 
              onValueChange={(value) => handleChange('title', value)}
            >
              <SelectTrigger className="bg-gray-700/50 border-gray-600">
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mr">Mr</SelectItem>
                <SelectItem value="mrs">Mrs</SelectItem>
                <SelectItem value="ms">Ms</SelectItem>
                <SelectItem value="miss">Miss</SelectItem>
                <SelectItem value="dr">Dr</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select 
              value={formData.gender} 
              onValueChange={(value) => handleChange('gender', value)}
            >
              <SelectTrigger className="bg-gray-700/50 border-gray-600">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m">Male</SelectItem>
                <SelectItem value="f">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              placeholder="Enter first name"
              className="bg-gray-700/50 border-gray-600"
              value={formData.first_name || ''}
              onChange={(e) => handleChange('first_name', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              placeholder="Enter last name"
              className="bg-gray-700/50 border-gray-600"
              value={formData.last_name || ''}
              onChange={(e) => handleChange('last_name', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input
              type="date"
              className="bg-gray-700/50 border-gray-600"
              value={formData.date_of_birth || ''}
              onChange={(e) => handleChange('date_of_birth', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter email"
              className="bg-gray-700/50 border-gray-600"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              type="tel"
              placeholder="Enter phone number"
              className="bg-gray-700/50 border-gray-600"
              value={formData.phone_number || ''}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Passport Number</Label>
            <Input
              placeholder="Enter passport number"
              className="bg-gray-700/50 border-gray-600"
              value={formData.passport_number || ''}
              onChange={(e) => handleChange('passport_number', e.target.value)}
              required
            />
          </div>
        </div>
      </div>
    </Card>
  );
};