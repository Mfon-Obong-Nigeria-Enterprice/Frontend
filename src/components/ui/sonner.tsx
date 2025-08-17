"use client"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type SonnerToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: SonnerToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as SonnerToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          background: "var(--popover)",
          color: "var(--popover-foreground)",
          border: "var(--border)",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }