/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ClientAccountSettings, clientAccountSettingsSchema } from "@/schemas/SettingsSchemas";

interface ClientAccountSettingsFormProps {
  settings: ClientAccountSettings;
  onThresholdChange: (key: string, value: number) => void;
}

export function ClientAccountSettingsForm({ settings, onThresholdChange }: ClientAccountSettingsFormProps) {
  const [isSaved, setIsSaved] = useState(false);

  const form = useForm<ClientAccountSettings>({
    resolver: zodResolver(clientAccountSettingsSchema),
    defaultValues: settings,
  });

  const handleNumberChange = (field: any, key: string, value: string) => {
    const numericValue = parseInt(value) || 0;
    field.onChange(numericValue);
    onThresholdChange(key, numericValue);
  };

  function onSubmit(_data: ClientAccountSettings) {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold border-b border-gray-300 pb-2">Clients Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="defaultCreditLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Default Credit Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => handleNumberChange(field, 'defaultCreditLimit', e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inactivePeriodDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Inactive Period (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => handleNumberChange(field, 'inactivePeriodDays', e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
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