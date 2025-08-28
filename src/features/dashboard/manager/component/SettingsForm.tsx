"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { settingsSchema, type SettingsFormData } from "@/schemas/SettingsSchemas";
import { useSettingsStore } from "@/stores/useSettingsStore";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsForm() {
  const { currentSettings, setSetting } = useSettingsStore();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: currentSettings,
  });

  async function onSubmit(data: SettingsFormData) {
    console.log("Form data:", data);
    
    // Update each setting individually
    Object.entries(data).forEach(([key, value]) => {
      setSetting(key as keyof SettingsFormData, value);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* === Notification Settings Section === */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Clients Debts Alert */}
              <FormField
                control={form.control}
                name="clientsDebtsAlert"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Clients Debts Alert
                      </FormLabel>
                      <FormDescription>
                        Receive alerts when clients have outstanding debts
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

              {/* Large Balance Alert */}
              <FormField
                control={form.control}
                name="largeBalanceAlert"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Large Balance Alert
                      </FormLabel>
                      <FormDescription>
                        Receive alerts for large account balances
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

              {/* Low Stock Alert */}
              <FormField
                control={form.control}
                name="lowStockAlert"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Low Stock Alert
                      </FormLabel>
                      <FormDescription>
                        Receive alerts when inventory is low
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
            </CardContent>
          </Card>

          {/* === Additional Settings Section === */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Additional Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Inactivity Alerts */}
              <FormField
                control={form.control}
                name="inactivityAlerts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Inactivity Alerts
                      </FormLabel>
                      <FormDescription>
                        Receive alerts for inactive accounts
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

              {/* Dashboard Notification */}
              <FormField
                control={form.control}
                name="dashboardNotification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Dashboard Notification
                      </FormLabel>
                      <FormDescription>
                        Show notifications on the dashboard
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

              {/* Email Notification */}
              <FormField
                control={form.control}
                name="emailNotification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Email Notification
                      </FormLabel>
                      <FormDescription>
                        Receive notifications via email
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
            </CardContent>
          </Card>
        </div>

        {/* Save Changes button outside the cards */}
        <div className="flex justify-end mt-4">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}