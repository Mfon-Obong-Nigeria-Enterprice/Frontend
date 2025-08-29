/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { systemPreferencesSchema, type SystemPreferences } from "@/types/types";

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
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="lowStockAlertThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Low Stock Alert Threshold</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
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
                  <FormLabel className="text-sm font-normal">Maximum Discount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => handleNumberChange(field, 'maximumDiscount', e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bulkDiscountThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Bulk Discount Threshold</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => handleNumberChange(field, 'bulkDiscountThreshold', e.target.value)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs font-normal">
                    Minimum purchase amount for bulk discount
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <FormField
              control={form.control}
              name="minimumPurchaseForBulkDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Minimum Purchase for Bulk Discount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => handleNumberChange(field, 'minimumPurchaseForBulkDiscount', e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs font-normal">Allow Negative Balances</p>
              </div>
              
              <FormField
                control={form.control}
                name="allowNegativeBalances"
                render={({ field }) => (
                  <FormControl className="">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-700"
                    />
                  </FormControl>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              {isSaved ? "Saved!" : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}