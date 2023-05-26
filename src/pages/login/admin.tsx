import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod"
import { useRouter } from "next/router";
import { api } from "@/lib/axios";
import uuid from "react-uuid";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useContext } from "react";
import { ItemsContext } from "@/contexts/Context";

const schema = z.object({
  email: z.string().email({ message: 'Informe um email válido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
    .max(20, { message: 'Senha pode ter no máximo 20 caracteres' }),
})

export type UserSchema = z.infer<typeof schema>;

export default function Login() {

  const { login } = useContext(ItemsContext)

  const router = useRouter()

  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<UserSchema>({
    resolver: zodResolver(schema)
  })

  const onSubmit: SubmitHandler<UserSchema> = async (dataForm) => {

    login(dataForm, 'admin')

  }


  return (
    <div className='flex items-center justify-center w-full h-screen'>

      <form
        className='w-[30rem] h-96 rounded-md default-shadow 
      bg-zinc-50 flex flex-col p-5 items-center gap-5 justify-center'
        onSubmit={handleSubmit(onSubmit)}
      >

        <h2 className='text-lg italic text-zinc-700 font-semibold'>Login Admin</h2>

        <input
          type="text"
          className='w-3/4 h-10 rounded border p-2'
          placeholder='Email'
          {...register('email')}
        />
        <input
          type="text"
          className='w-3/4 h-10 rounded border p-2'
          placeholder='Senha'
          {...register('password')}
        />
        {
          errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span> ||
          errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>
        }
        <button className='px-10 py-3 rounded bg-blue-500 text-white'>Entrar</button>

      </form>
      <ToastContainer autoClose={1000}/>
    </div>
  )
}
