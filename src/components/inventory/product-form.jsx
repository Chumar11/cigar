"use client"

import { useState } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// import * as z from "zod"
import { QrCode } from "lucide-react"
import { Button, TextField, InputAdornment, FormControl, FormHelperText, Box } from "@mui/material"
// import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// const formSchema = z.object({
//   upc: z.string().min(1, "UPC is required"),
//   name: z.string().min(1, "Product name is required"),
//   quantity: z.coerce.number().min(0, "Quantity must be 0 or greater"),
//   price: z.coerce.number().min(0, "Price must be 0 or greater").optional(),
//   description: z.string().optional(),
// })

export function ProductForm({ initialUpc = "" }) {
  const [scanning, setScanning] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      upc: initialUpc,
      name: "",
      quantity: 1,
      price: undefined,
      description: "",
    },
  })

  function onSubmit(values) {
    // This would connect to your backend in a real implementation
    console.log(values)
    toast({
      title: "Product saved",
      description: `${values.name} has been added to inventory.`,
    })

    // Redirect to inventory page after saving
    setTimeout(() => {
      router.push("/inventory")
    }, 1500)
  }

  function handleScanUPC() {
    setScanning(true)
    // In a real implementation, this would activate a barcode scanner
    // For demo purposes, we'll simulate finding a UPC after a delay
    setTimeout(() => {
      form.setValue("upc", "987654321098")
      setScanning(false)
      toast({
        title: "UPC Scanned",
        description: "UPC code successfully scanned.",
      })
    }, 2000)
  }

  return (
    <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "end" }}>
        <FormControl fullWidth>
          <TextField
            label="UPC Code"
            variant="outlined"
            {...form.register("upc")}
            placeholder="Enter UPC code"
            fullWidth
            error={!!form.formState.errors.upc}
            helperText={form.formState.errors.upc?.message}
          />
        </FormControl>

        <Button variant="outlined" onClick={handleScanUPC} disabled={scanning} sx={{ display: "flex", alignItems: "center" }}>
          <QrCode sx={{ mr: 1 }} />
          {scanning ? "Scanning..." : "Scan UPC"}
        </Button>
      </Box>

      <FormControl fullWidth>
        <TextField
          label="Product Name"
          variant="outlined"
          {...form.register("name")}
          placeholder="Enter product name"
          error={!!form.formState.errors.name}
          helperText={form.formState.errors.name?.message}
        />
      </FormControl>

      <Box sx={{ display: "flex", gap: 2 }}>
        <FormControl fullWidth>
          <TextField
            label="Quantity"
            variant="outlined"
            type="number"
            {...form.register("quantity")}
            error={!!form.formState.errors.quantity}
            helperText={form.formState.errors.quantity?.message}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Price (Optional)"
            variant="outlined"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...form.register("price")}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            error={!!form.formState.errors.price}
            helperText={form.formState.errors.price?.message}
          />
        </FormControl>
      </Box>

      <FormControl fullWidth>
        <TextField
          label="Description (Optional)"
          variant="outlined"
          multiline
          rows={4}
          {...form.register("description")}
          error={!!form.formState.errors.description}
          helperText={form.formState.errors.description?.message}
        />
      </FormControl>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button type="submit" variant="contained">
          Save Product
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => router.push("/inventory")}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  )
}
