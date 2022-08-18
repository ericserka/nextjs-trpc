import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { trpc } from '../utils/trpc'

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
