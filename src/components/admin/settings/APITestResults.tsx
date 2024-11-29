import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlayCircle } from "lucide-react";

type TestStatus = 'pending' | 'success' | 'error' | 'warning';

interface TestResult {
  status: TestStatus;
  message: string;
}

interface TestResults {
  supabase: TestResult;
  duffel: TestResult;
}

export const APITestResults = () => {
  const { toast } = useToast();

  const { data: testResults, refetch: runTests, isLoading } = useQuery({
    queryKey: ['api-tests'],
    queryFn: async () => {
      const results: TestResults = {
        supabase: { status: 'pending', message: '' },
        duffel: { status: 'pending', message: '' }
      };

      // Test Supabase
      try {
        const start = performance.now();
        const { data, error } = await supabase.from('airports').select('id').limit(1);
        const duration = Math.round(performance.now() - start);
        
        if (error) {
          results.supabase = { 
            status: 'error', 
            message: `Error: ${error.message} (${duration}ms)`
          };
        } else {
          results.supabase = { 
            status: 'success', 
            message: `Connected successfully (${duration}ms)`
          };
        }
      } catch (error: any) {
        results.supabase = { 
          status: 'error', 
          message: `Error: ${error.message}`
        };
      }

      // Test Duffel
      try {
        const start = performance.now();
        const { data, error } = await supabase.from('api_credentials')
          .select('*')
          .eq('provider', 'duffel')
          .single();
        const duration = Math.round(performance.now() - start);

        if (error) {
          results.duffel = { 
            status: 'error', 
            message: `Error: ${error.message} (${duration}ms)`
          };
        } else if (!data) {
          results.duffel = { 
            status: 'warning', 
            message: 'API not configured'
          };
        } else {
          // Test Duffel API connection
          const { error: duffelError } = await supabase.functions.invoke('duffel-proxy', {
            body: {
              path: '/air/offers',
              method: 'GET'
            }
          });

          if (duffelError) {
            results.duffel = { 
              status: 'error', 
              message: `API Error: ${duffelError.message} (${duration}ms)`
            };
          } else {
            results.duffel = { 
              status: 'success', 
              message: `Connected successfully (${duration}ms)`
            };
          }
        }
      } catch (error: any) {
        results.duffel = { 
          status: 'error', 
          message: `Error: ${error.message}`
        };
      }

      return results;
    },
    enabled: false
  });

  const handleRunTests = () => {
    toast({
      title: "Running API Tests",
      description: "Testing connections to Supabase and Duffel..."
    });
    runTests();
  };

  const getStatusBadge = (status: TestStatus) => {
    const styles = {
      pending: 'bg-gray-500/20 text-gray-400',
      success: 'bg-green-500/20 text-green-400',
      error: 'bg-red-500/20 text-red-400',
      warning: 'bg-yellow-500/20 text-yellow-400'
    };

    return styles[status];
  };

  return (
    <Card className="p-4 bg-gray-800/30 border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-200">API Connection Tests</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRunTests}
          disabled={isLoading}
          className="border-gray-600 hover:bg-gray-700"
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          Run Tests
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Supabase Connection</span>
            <Badge className={getStatusBadge(testResults?.supabase.status || 'pending')}>
              {isLoading ? 'Testing...' : testResults?.supabase.status || 'Not tested'}
            </Badge>
          </div>
          {testResults?.supabase.message && (
            <p className="text-xs text-gray-400">{testResults.supabase.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Duffel API</span>
            <Badge className={getStatusBadge(testResults?.duffel.status || 'pending')}>
              {isLoading ? 'Testing...' : testResults?.duffel.status || 'Not tested'}
            </Badge>
          </div>
          {testResults?.duffel.message && (
            <p className="text-xs text-gray-400">{testResults.duffel.message}</p>
          )}
        </div>
      </div>
    </Card>
  );
};