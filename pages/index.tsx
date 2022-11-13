import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Unauthorized from '../components/Unauthorized'

export default function Home() {
  return (
    <Unauthorized />
  )
}
