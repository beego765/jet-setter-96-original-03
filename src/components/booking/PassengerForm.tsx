import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PassengerFormProps {
  index: number;
  type: string;
  onChange: (index: number, data: any) => void;
}

export const PassengerForm = ({ index, type, onChange }: PassengerFormProps) => {
  const handleChange = (field: string, value: string) => {
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
            <Select onValueChange={(value) => handleChange('title', value)}>
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
            <Select onValueChange={(value) => handleChange('gender', value)}>
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
              onChange={(e) => handleChange('firstName', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              placeholder="Enter last name"
              className="bg-gray-700/50 border-gray-600"
              onChange={(e) => handleChange('lastName', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input
              type="date"
              className="bg-gray-700/50 border-gray-600"
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter email"
              className="bg-gray-700/50 border-gray-600"
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
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Passport Number</Label>
            <Input
              placeholder="Enter passport number"
              className="bg-gray-700/50 border-gray-600"
              onChange={(e) => handleChange('passportNumber', e.target.value)}
              required
            />
          </div>
        </div>
      </div>
    </Card>
  );
};