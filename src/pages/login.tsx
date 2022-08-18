import Link from 'next/link'
import { useRouter } from 'next/router'
import { CreateUserInput } from '@/schema/user.schema'
import { trpc } from '@/utils/trpc'

export default function Login() {
  const router = useRouter()
  const { mutate, error } = trpc.useMutation(['users.register-user'], {
    onSuccess: () => {
      router.push('/login')
    },
  })

  const onSubmit = (values: CreateUserInput) => {
    mutate(values)
  }
  return (
    <>
      <h1>Login</h1>
      {error && error.message}
      <Link href="/register">Register</Link>
    </>
  )
}
