import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMarkupSettings = () => {
  return useQuery({
    queryKey: ['markup-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_markup_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });
};

export const calculatePriceWithMarkup = (basePrice: number, markupSettings: any) => {
  if (!markupSettings) return basePrice;

  if (markupSettings.markup_type === 'percentage') {
    return basePrice * (1 + markupSettings.markup_value / 100);
  } else {
    return basePrice + markupSettings.markup_value;
  }
};