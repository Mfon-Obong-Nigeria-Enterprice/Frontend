import  { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ClientAccountSettings, clientAccountSettingsSchema } from "@/types/types";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function ClientAccountSettingsForm() {
  const { clientAccountSettings, setClientAccountSettings } = useSettingsStore();
  const [isSaved, setIsSaved] = useState(false);

  const form = useForm<ClientAccountSettings>({
    resolver: zodResolver(clientAccountSettingsSchema),
    defaultValues: clientAccountSettings,
  });

  function onSubmit(data: ClientAccountSettings) {
    setClientAccountSettings(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Clients Account Settings</CardTitle>
        <CardDescription>Configure client account preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="defaultCreditLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Credit Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    The default credit limit assigned to new clients
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inactivePeriodDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inactive Period (Days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Number of days before a client is considered inactive
                  </FormDescription>
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