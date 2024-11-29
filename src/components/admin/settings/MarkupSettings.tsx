import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export const MarkupSettings = () => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [markupType, setMarkupType] = useState<'percentage' | 'fixed'>('percentage');
  const [markupValue, setMarkupValue] = useState(0);

  const { data: markupSettings, isLoading } = useQuery({
    queryKey: ['markup-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_markup_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      setMarkupType(data.markup_type);
      setMarkupValue(data.markup_value);
      return data;
    }
  });

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('price_markup_settings')
        .update({ 
          markup_type: markupType, 
          markup_value: markupValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', markupSettings?.id);

      if (error) throw error;

      toast({
        title: "Settings Updated",
        description: "Markup settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating markup settings:', error);
      toast({
        title: "Error",
        description: "Failed to update markup settings.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Markup Type</Label>
        <RadioGroup
          value={markupType}
          onValueChange={(value: 'percentage' | 'fixed') => setMarkupType(value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percentage" id="percentage" />
            <Label htmlFor="percentage">Percentage</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="fixed" />
            <Label htmlFor="fixed">Fixed Amount</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>
          {markupType === 'percentage' ? 'Percentage Value' : 'Fixed Amount'}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={markupValue}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                setMarkupValue(value);
              }
            }}
            className="bg-gray-700/50 border-gray-600 text-gray-200"
            disabled={isUpdating}
          />
          <span className="text-gray-400">
            {markupType === 'percentage' ? '%' : '£'}
          </span>
        </div>
      </div>

      <Button 
        onClick={handleSave}
        disabled={isUpdating}
        className="w-full"
      >
        {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Save Markup Settings
      </Button>
    </div>
  );
};