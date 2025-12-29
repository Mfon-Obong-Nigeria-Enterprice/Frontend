/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { systemPreferencesSchema, type SystemPreferences } from "@/schemas/SettingsSchemas";

interface SystemPreferencesFormProps {
  settings: SystemPreferences;
  onThresholdChange: (key: string, value: number) => void;
}

export function SystemPreferencesForm({ settings, onThresholdChange }: SystemPreferencesFormProps) {
  const [isSaved, setIsSaved] = useState(false);

  const form = useForm<SystemPreferences>({
    resolver: zodResolver(systemPreferencesSchema),
    defaultValues: settings,
  });

  const handleNumberChange = (field: any, key: string, value: string) => {
    const numericValue = parseInt(value) || 0;
    field.onChange(numericValue);
    onThresholdChange(key, numericValue);
  };

  function onSubmit(_data: SystemPreferences) {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold border-b border-gray-300 pb-2">
           System Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Grid for Inputs: Side-by-side on tablet/desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lowStockAlertThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal text-gray-700">Low Stock Alert Threshold</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="bg-white border-gray-200"
                        value={field.value}
                        onChange={(e) => handleNumberChange(field, 'lowStockAlertThreshold', e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maximumDiscount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal text-gray-700">Maximum Discount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="bg-white border-gray-200"
                        value={field.value}
                        onChange={(e) => handleNumberChange(field, 'maximumDiscount', e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Toggle Row: Justified Between */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-normal text-gray-700">Allow Negative Balances</p>
              </div>
              
              <FormField
                control={form.control}
                name="allowNegativeBalances"
                render={({ field }) => (
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </FormControl>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90 text-white font-medium"
            >
              {isSaved ? "Saved!" : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}