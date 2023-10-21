import Image from 'next/image'
import { Inter } from 'next/font/google'
import Gradient from '@/components/Gradient'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import FirstPageLayout from '@/components/Layout/FirstPageLayout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [randomNum, setRandomNum] = useState(0)
  useEffect(() => {
    const randomNumber = Math.random();
    setRandomNum(randomNumber)
  }, [])

  return (
    <>
      <FirstPageLayout title='eTask'>
        <div className="flex items-center justify-center h-screen">
          <div className=''>
            <h1 className='text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-br from-[#00ff87] to-[#60efff]'>
              eTask
            </h1>
            <p className='text-center font-semibold text-slate-600 mt-2 text-lg dark:text-white'>{
              randomNum >= 0.7 ? (
                'Manage, Accomplish, Repeat.'
              ) : (
                'Boost Your Productivity with Ease.'
              )
            }</p>
            <div className='flex justify-center gap-3 mt-3'>
              <Link href={"/login"} className='btn bg-green-400 text-white hover:bg-[#60efff]'>Get Started</Link>
              <Link href={"/about"} className='btn bg-transparent hover:bg-green-500 hover:text-white'>Learn More</Link>
            </div>
          </div>
        </div>
      </FirstPageLayout>
    </>
  )
}
