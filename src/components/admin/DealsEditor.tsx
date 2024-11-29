import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { supabase } from "../../integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { DealForm } from "./deals/DealForm";
import { DealsList } from "./deals/DealsList";
import { NewDeal } from "./types/deals";

export const DealsEditor = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [newDeal, setNewDeal] = useState<NewDeal>({
    title: "",
    description: "",
    discount: "",
    valid_until: "",
    price: 0,
    category: "weekend",
    original_price: 0,
    destination: "",
    image_url: ""
  });

  const { data: deals, isLoading, refetch } = useQuery({
    queryKey: ['admin-deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddDeal = async () => {
    try {
      const { error } = await supabase
        .from('deals')
        .insert({
          ...newDeal,
          price: Number(newDeal.price),
          original_price: Number(newDeal.original_price)
        });

      if (error) throw error;
      
      toast.success('Deal added successfully');
      setIsAdding(false);
      setNewDeal({
        title: "",
        description: "",
        discount: "",
        valid_until: "",
        price: 0,
        category: "weekend",
        original_price: 0,
        destination: "",
        image_url: ""
      });
      refetch();
    } catch (error) {
      console.error('Error adding deal:', error);
      toast.error('Failed to add deal');
    }
  };

  const handleDeleteDeal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Deal deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Failed to delete deal');
    }
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-lg border-gray-700 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Deals Management</h2>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-purple-500 hover:bg-purple-600"
        >
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4 mr-2" /> Add Deal</>}
        </Button>
      </div>

      {isAdding && (
        <DealForm 
          newDeal={newDeal}
          onDealChange={setNewDeal}
          onSubmit={handleAddDeal}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <DealsList deals={deals || []} onDelete={handleDeleteDeal} />
      )}
    </Card>
  );
};