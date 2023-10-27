import Image from 'next/image'
import { Inter } from 'next/font/google'
import Gradient from '@/components/Gradient'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import FirstPageLayout from '@/components/Layout/FirstPageLayout'
import { Button } from "@nextui-org/react";
import { useRouter } from 'next/router'


export default function Home() {
  const [randomNum, setRandomNum] = useState(0)
  const router = useRouter()
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
              <Button type='submit' className='bg-green-400 text-white hover:bg-[#60efff] font-semibold ' size='lg' radius='sm' onPress={e => { router.push('/login') }}>
                <Link href={"/login"}>
                  Get Started
                </Link>
              </Button>
              <Button type='reset' className='bg-transparent hover:bg-green-500 hover:text-white font-semibold' variant='bordered' size='lg' radius='sm' onPress={e => { router.push('/about') }}>
                <Link href={"/about"}>
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </FirstPageLayout>
    </>
  )
}
