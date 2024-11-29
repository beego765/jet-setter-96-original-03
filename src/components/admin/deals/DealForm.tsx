import { NewDeal, DealCategory } from "../types/deals";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useState } from "react";
import { supabase } from "../../../integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

interface DealFormProps {
  newDeal: NewDeal;
  onDealChange: (deal: NewDeal) => void;
  onSubmit: () => void;
}

export const DealForm = ({ newDeal, onDealChange, onSubmit }: DealFormProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (field: keyof NewDeal, value: string) => {
    onDealChange({ ...newDeal, [field]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('deals')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('deals')
        .getPublicUrl(filePath);

      handleChange('image_url', publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 mb-6 p-4 bg-gray-700/30 rounded-lg">
      <Input
        placeholder="Title"
        value={newDeal.title}
        onChange={(e) => handleChange('title', e.target.value)}
        className="bg-gray-800 border-gray-600"
      />
      <Textarea
        placeholder="Description"
        value={newDeal.description}
        onChange={(e) => handleChange('description', e.target.value)}
        className="bg-gray-800 border-gray-600"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Discount (e.g., 20% OFF)"
          value={newDeal.discount}
          onChange={(e) => handleChange('discount', e.target.value)}
          className="bg-gray-800 border-gray-600"
        />
        <Input
          type="datetime-local"
          value={newDeal.valid_until}
          onChange={(e) => handleChange('valid_until', e.target.value)}
          className="bg-gray-800 border-gray-600"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="Price"
          value={newDeal.price}
          onChange={(e) => handleChange('price', e.target.value)}
          className="bg-gray-800 border-gray-600"
        />
        <Input
          type="number"
          placeholder="Original Price"
          value={newDeal.original_price}
          onChange={(e) => handleChange('original_price', e.target.value)}
          className="bg-gray-800 border-gray-600"
        />
      </div>
      <Select
        value={newDeal.category}
        onValueChange={(value: DealCategory) => handleChange('category', value)}
      >
        <SelectTrigger className="bg-gray-800 border-gray-600">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weekend">Weekend</SelectItem>
          <SelectItem value="seasonal">Seasonal</SelectItem>
          <SelectItem value="business">Business</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Destination"
        value={newDeal.destination}
        onChange={(e) => handleChange('destination', e.target.value)}
        className="bg-gray-800 border-gray-600"
      />
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="bg-gray-800 border-gray-600"
            disabled={isUploading}
          />
          {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
        </div>
        {newDeal.image_url && (
          <div className="relative w-full h-32 rounded-lg overflow-hidden">
            <img 
              src={newDeal.image_url} 
              alt="Deal preview" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      <Button onClick={onSubmit} className="w-full bg-green-500 hover:bg-green-600">
        Add Deal
      </Button>
    </div>
  );
};