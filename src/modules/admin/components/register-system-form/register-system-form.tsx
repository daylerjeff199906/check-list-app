"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { ISystem } from "@/types"
import { saveSystem, updateSystem } from "@/api"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"

// Define schema with zod
export const systemFormSchema = z.object({
  name: z.string().min(3, "The name must be at least 3 characters long"),
  description: z.string().optional(),
  status: z.boolean()
})

type SystemFormData = z.infer<typeof systemFormSchema>

interface RegisterSystemFormProps {
  defaultValues?: ISystem
}

export const RegisterSystemForm = (props: RegisterSystemFormProps) => {
  const { defaultValues } = props
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<SystemFormData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SystemFormData>({
    resolver: zodResolver(systemFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      status: defaultValues?.status || true
    }
  })

  const onSubmit = (data: SystemFormData) => {
    setFormData(data)
    setIsDialogOpen(true)
  }

  const confirmSubmit = async () => {
    setIsLoaded(true)
    if (formData) {
      if (defaultValues) {
        await updateSystem(defaultValues.id, formData)
      } else {
        await saveSystem(formData)
      }

      reset()
      router.push("/admin/alerts")
      setIsDialogOpen(false)
    }
    setIsLoaded(false)
  }

  const status = watch("status")

  return (
    <>
      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {defaultValues ? "Editar sistema" : "Actualizar Sistema"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                htmlFor="systemName"
                className="text-sm font-medium"
              >
                Nombre del sistema
              </label>
              <Input
                id="systemName"
                placeholder="Enter system name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium"
              >
                Descripción del sistema
              </label>
              <Textarea
                id="description"
                placeholder="Enter system description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-medium"
              >
                Estado
              </label>
              <Select
                onValueChange={(value) =>
                  setValue("status", value === "true", { shouldValidate: true })
                }
                defaultValue="true"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm">Status is required</p>
              )}
            </div>
            <div className="mt-4 flex justify-between">
              <Button
                variant="outline"
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isLoaded}
              >
                {isLoaded ? <Loader className="animate-spin" /> : null}
                {defaultValues ? "Update System" : "Register System"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to save this system?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmSubmit}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
