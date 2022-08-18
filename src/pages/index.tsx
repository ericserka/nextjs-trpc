import type { NextPage } from 'next'
import { trpc } from '@/utils/trpc'

const Home: NextPage = () => {
  const { data, error, isLoading } = trpc.useQuery(['hello'])

  return (
    <p>
      {isLoading
        ? 'Loading...'
        : error
        ? JSON.stringify(error)
        : JSON.stringify(data)}
    </p>
  )
}

export default Home
