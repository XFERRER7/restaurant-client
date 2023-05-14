import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod"
import { api } from "@/lib/axios";
import { useRouter } from "next/router";
import uuid from "react-uuid";
import { toast } from "react-toastify";

const schema = z.object({
  name: z.string().max(20, { message: 'Nome pode ter no máximo 60 caracteres' }).nonempty({ message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Informe um email válido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
    .max(20, { message: 'Senha pode ter no máximo 20 caracteres' }),
})

type UserSchema = z.infer<typeof schema>;

export default function Register() {

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

    try {
      const response = await api.post('client/create', dataForm)
      const data = response.data
      console.log(data)
      if(data.id && data.email == dataForm.email) {
        router.push('/login/client')
        toast.success('Usuário cadastrado com sucesso')
        reset()
      }

    }
    catch (error) {
      toast.error('Usuário ou senha inválidos')
    }

  }

  return (
    <div className='flex items-center justify-center w-full h-screen'>

      <form
        className='w-[30rem] h-96 rounded-md default-shadow 
      bg-zinc-50 flex flex-col p-5 items-center gap-5 justify-center'
        onSubmit={handleSubmit(onSubmit)}
      >

        <h2 className='text-lg italic text-zinc-700 font-semibold'>Cadastro User</h2>

        <input
          type="text"
          className='w-3/4 h-10 rounded border p-2'
          placeholder='Nome'
          {...register('name')}
        />
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
          errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span> ||
          errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span> ||
          errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>
        }
        <button className='px-10 py-3 rounded bg-violet-700 text-white'>Entrar</button>


        <div>
          <span className='text-gray-500 text-sm'>Já tem uma conta?</span>
          <a className='text-violet-700 text-sm cursor-pointer' 
          onClick={(() => router.push('/login/client'))}
          > Entrar</a>
        </div>

      </form>

    </div>
  )
}
