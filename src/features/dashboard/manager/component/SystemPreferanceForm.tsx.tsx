import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { systemPreferencesSchema, type SystemPreferences } from "@/types/types";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { SettingsIcon } from "lucide-react";

export function SystemPreferencesForm() {
  const { systemPreferences, setSystemPreferences } = useSettingsStore();
  const [isSaved, setIsSaved] = useState(false);

  const form = useForm<SystemPreferences>({
    resolver: zodResolver(systemPreferencesSchema),
    defaultValues: systemPreferences,
  });

  function onSubmit(data: SystemPreferences) {
    setSystemPreferences(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <SettingsIcon className="h-5 w-5" />
          System Preferences
        </CardTitle>
        <CardDescription>Manage your system preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="lowStockAlertThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock Alert Threshold</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                  <FormLabel>Maximum Discount (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                  <FormLabel>Bulk Discount Threshold</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum purchase amount for bulk discount
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowNegativeBalances"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Allow Negative Balances</FormLabel>
                    <FormDescription>
                      Allow customers to have negative account balances
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {isSaved ? "Saved!" : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}