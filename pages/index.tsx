import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Unauthorized from '../components/Unauthorized'
import Authorized from '../components/Authorized'
import { isAuthenticated } from '../helpers/helpers'


export default function Home() {
  return (
    <>
       {isAuthenticated() ? <Authorized/> : <Unauthorized/>}
    </>
  )
}
