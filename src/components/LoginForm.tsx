import { RequestOtpInput, requestOtpSchema } from '@/schema/user.schema'
import { trpc } from '@/utils/trpc'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

const VerifyToken = ({ hash }: { hash: string }) => {
  const router = useRouter()
  const { data, isLoading } = trpc.useQuery([
    'users.verify-otp',
    {
      hash,
    },
  ])

  if (isLoading) {
    return (
      <p className="text-5xl text-center font-bold">
        Token found. Checking validity...
      </p>
    )
  }
  router.push(data?.redirect.includes('login') ? '/' : data?.redirect || '/')

  return (
    <p className="text-5xl text-center font-bold">
      Valid Token. Redirecting...
    </p>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const { mutate, error, isLoading } = trpc.useMutation(['users.request-otp'], {
    onSuccess: () => {
      alert('Check your email')
    },
    onError: (error: any) => {
      alert(error.message)
    },
  })
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RequestOtpInput>({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: { redirect: undefined, email: undefined },
  })

  const onSubmit = (values: RequestOtpInput) => {
    mutate({ ...values, redirect: router.asPath })
  }

  const hash = router.asPath.split('#token=')[1]
  if (hash) {
    return <VerifyToken hash={hash} />
  }
  return (
    <>
      <h1 className="text-6xl text-center font-bold">Login</h1>
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
          <p className="text-red-600">{errors.email?.message}</p>
        )}
        <button
          className="mt-3 rounded-lg bg-sky-300 enabled:hover:bg-sky-400 px-2 py-2 font-bold"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && (
            <FontAwesomeIcon
              className="inline mr-3 w-4 h-4 text-white fa-spin"
              icon={faSpinner}
            />
          )}
          {isLoading ? 'Loading...' : 'Login'}
        </button>
        <br />
        <div className="mt-3">
          <Link href="/register">
            <a className="rounded-lg bg-slate-300 hover:bg-slate-400 px-2 py-2 font-bold">
              Register
            </a>
          </Link>
        </div>
      </form>
    </>
  )
}
