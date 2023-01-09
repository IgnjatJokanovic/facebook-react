import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Unauthorized from '../components/Unauthorized'
import Authorized from '../components/Authorized'
import Context from '../context/context'
import { useContext } from 'react'


export default function Home() {
  const ctx = useContext(Context)
  
  return (
    <>
       {ctx.authenticated ? <Authorized/> : <Unauthorized/>}
    </>
  )
}
