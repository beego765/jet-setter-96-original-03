import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { supabase } from "../../integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Trash } from "lucide-react";

export const DealsEditor = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: "",
    description: "",
    discount: "",
    valid_until: "",
    price: "",
    category: "weekend",
    original_price: "",
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
        .insert([{
          ...newDeal,
          price: parseFloat(newDeal.price),
          original_price: parseFloat(newDeal.original_price)
        }]);

      if (error) throw error;
      
      toast.success('Deal added successfully');
      setIsAdding(false);
      setNewDeal({
        title: "",
        description: "",
        discount: "",
        valid_until: "",
        price: "",
        category: "weekend",
        original_price: "",
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
        <div className="space-y-4 mb-6 p-4 bg-gray-700/30 rounded-lg">
          <Input
            placeholder="Title"
            value={newDeal.title}
            onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
            className="bg-gray-800 border-gray-600"
          />
          <Textarea
            placeholder="Description"
            value={newDeal.description}
            onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
            className="bg-gray-800 border-gray-600"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Discount (e.g., 20% OFF)"
              value={newDeal.discount}
              onChange={(e) => setNewDeal({ ...newDeal, discount: e.target.value })}
              className="bg-gray-800 border-gray-600"
            />
            <Input
              type="datetime-local"
              value={newDeal.valid_until}
              onChange={(e) => setNewDeal({ ...newDeal, valid_until: e.target.value })}
              className="bg-gray-800 border-gray-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Price"
              value={newDeal.price}
              onChange={(e) => setNewDeal({ ...newDeal, price: e.target.value })}
              className="bg-gray-800 border-gray-600"
            />
            <Input
              type="number"
              placeholder="Original Price"
              value={newDeal.original_price}
              onChange={(e) => setNewDeal({ ...newDeal, original_price: e.target.value })}
              className="bg-gray-800 border-gray-600"
            />
          </div>
          <Select
            value={newDeal.category}
            onValueChange={(value) => setNewDeal({ ...newDeal, category: value })}
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
            onChange={(e) => setNewDeal({ ...newDeal, destination: e.target.value })}
            className="bg-gray-800 border-gray-600"
          />
          <Input
            placeholder="Image URL"
            value={newDeal.image_url}
            onChange={(e) => setNewDeal({ ...newDeal, image_url: e.target.value })}
            className="bg-gray-800 border-gray-600"
          />
          <Button onClick={handleAddDeal} className="w-full bg-green-500 hover:bg-green-600">
            Add Deal
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="space-y-4">
          {deals?.map((deal) => (
            <div
              key={deal.id}
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-200">{deal.title}</h3>
                <p className="text-sm text-gray-400">
                  {deal.destination} - {deal.discount}
                </p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteDeal(deal.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};