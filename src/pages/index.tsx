import type { NextPage } from 'next'
import LoginForm from '@/components/LoginForm'
import Link from 'next/link'
import { useUserContext } from '@/context/user.context'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  const user = useUserContext()
  const router = useRouter()

  if (!user) {
    router.push('/login')
    return <></>
  } else {
    return (
      <div>
        <Link href="/posts/new">Create post</Link>
      </div>
    )
  }
}

export default Home
