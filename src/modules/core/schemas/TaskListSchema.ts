import { date, z } from "zod"

export const TaskLisSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  description: z.string().optional(),
  date: z.string().optional(),
  status: z.boolean().optional(),
  location: z.string().optional(),
  coordinates: z.string().optional()
})

// export const TaskSchema = z.object({
//   id: z.string().optional(), // id opcional
//   task_list_id: z.number(),
//   system_id: z.number(),
//   chekList: z.string().min(2, {
//     message: "Name must be at least 2 characters."
//   }),
//   frecuency: z.string().min(2, {
//     message: "Name must be at least 2 characters."
//   }),
//   review: z.boolean().optional(),
//   note: z.string().optional(),
//   status: z.boolean().optional()
// })

// export const TaskManySchema = z.array(TaskSchema)
export const taskSchema = z.object({
  description: z.string().min(1, "La descripción es requerida"),
  status: z.enum(["true", "false"], {
    required_error: "El estado es requerido"
  }),
  frequency: z.string().min(1, "La frecuencia es requerida"),
  notes: z.string().optional(),
  system_id: z.number({ message: "El sistema es requerido" }),
  date: z.string().optional()
})

export const TaskManySchema = z.object({
  tasks: z.array(taskSchema)
})

export type TaskList = z.infer<typeof TaskLisSchema>
export type Task = z.infer<typeof taskSchema>
export type TaskMany = z.infer<typeof TaskManySchema>
