import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { CreateUserInput, createUserSchema } from '@/schema/user.schema'
import { trpc } from '@/utils/trpc'

const Register = () => {
  const router = useRouter()
  const { mutate, error, isLoading } = trpc.useMutation(
    ['users.register-user'],
    {
      onSuccess: () => {
        router.push('/login')
      },
      onError: (error) => {
        alert(error.message)
      },
    }
  )
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: undefined, email: undefined },
  })

  const onSubmit = (values: CreateUserInput) => {
    mutate(values)
  }

  return (
    <>
      <h1 className="text-6xl text-center font-bold">Register</h1>
      {/* another way to handle errors is access directly */}
      {/* {error && error.message} */}
      <form className="mt-20 ml-5" onSubmit={handleSubmit(onSubmit)}>
        <input
          className="border border-black px-1 py-1"
          type="email"
          placeholder="email@example.com"
          {...register('email')}
        />
        <br />
        {errors.email?.message && (
          <p className="text-red-600">{String(errors.email?.message)}</p>
        )}
        <input
          className="border border-black px-1 py-1 mt-1"
          type="text"
          placeholder="Your Name"
          {...register('name')}
        />
        <br />
        {errors.name?.message && (
          <p className="text-red-600">{String(errors.name?.message)}</p>
        )}
        <button
          className="mt-3 rounded-lg bg-sky-300 hover:bg-sky-400 px-2 py-2 font-bold"
          type="submit"
        >
          {isLoading && (
            <FontAwesomeIcon
              className="inline mr-3 w-4 h-4 text-white fa-spin"
              icon={faSpinner}
            />
          )}
          {isLoading ? 'Loading...' : 'Register'}
        </button>
        <br />
        <div className="mt-3 rounded-lg bg-slate-300 hover:bg-slate-400 px-2 py-2 font-bold w-16">
          <Link href="/login">Login</Link>
        </div>
      </form>
    </>
  )
}

export default Register
