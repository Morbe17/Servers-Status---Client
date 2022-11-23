import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { io } from 'socket.io-client'
import { useState, useLayoutEffect, useEffect } from 'react'
import moment from 'moment'
import Tag from '../src/components/Tag'
import Loading from '../src/components/Loading'
import Image from 'next/image'
import { motion } from "framer-motion"
import Button from '../src/components/Button'

export default function Home() {
  const [servers, setServers] = useState([])
  const [offlineServers, setOfflineServers] = useState(0)

  const forceCheckStatus = async (server, index) => {

    setServers((previous) => {
      console.log()
      previous[index].loading = true
      return [...previous]
    })

    try {
      const response = await fetch(`http://127.0.0.1:5100/serverStatus?ip=${server.ip}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        cors: 'no-cors'
      })

      setServers((previous) => {
        previous[index].loading = false
        return [...previous]
      })

      const data = await response.json()

      console.log(data)

    } catch (er) {

      setServers((previous) => {
        previous[index].loading = false
        return [...previous]
      })
      console.log(er)
    }
  }

  const turnServerOn = async (server, index) => {
    try {
      const response = await fetch(`http://127.0.0.1:5100/startServer?mac=${server.mac}&ip=${server.ip}`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cors: 'no-cors'
      })

      const data = await response.json()

      console.log(data)

    } catch (er) {
      console.log(er)
    }
  }

  const sendStatusEmail = async (server, index) =>{
    try{
      const response = await fetch(`http://127.0.0.1:5100/sendEmailSample`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        cors: 'no-cors'
      })
    }catch(err){

    }
  }

  useEffect(() => {
    const socket = io('http://localhost:5001')

    socket.on('update-status', (serversList) => {
      let count = 0
      serversList.sort((a, b) => {
        if (!a.online) {
          return -1
        }

        if (!b.online) {
          return 1
        }

        return 0
      })

      serversList.forEach((el) => {
        if (!el.online) count++
        el.loading = false
      })

      console.log(serversList)

      setOfflineServers(count)
      setServers(serversList);
    });

    return () => {
      socket.off('update-status');
      socket.disconnect();
    };
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Server Status Checker</title>
        <meta name="description" content="Constantly check your server status" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{display:'flex', justifyContent:'flex-end', width:'100%'}}>
          <Button elStyle={{width: "140px", height: '40px'}}  elClick={sendStatusEmail}>Send Status Email</Button>
        </div>
        <h1>Servers🖥</h1>
        <div style={{ display: 'flex' }}>

          <h3 style={{ margin: 0, marginRight: '10px' }}>Offline (<span style={{ color: 'red' }}>{offlineServers}</span>) </h3>
          <span>-</span>
          <h3 style={{ marginTop: 0, marginLeft: '10px' }}>Online (<span style={{ color: 'rgba(38, 208, 0, 1)' }}>{servers.length - offlineServers}</span>) </h3>
        </div>


        <div className={styles.ServersContainer}>
          <div className={styles.ServerList} style={{ marginBottom: '10px' }}>
            <label className={styles.HeadersTitle}>Name</label>
            <label className={styles.HeadersTitle}>IP</label>
            <label className={styles.HeadersTitle}>Status</label>
            <label className={styles.HeadersTitle}>Last Status Change</label>
            {/* <label style={{width:'25%'}}>Last Check</label> */}
            <label className={styles.HeadersTitle}>Check Status</label>
          </div>


          {servers.map((server, index) => {
            return <div key={index} className={styles.ServerList}>
              <label style={{ width: '25%' }}>{server.label}</label>
              <label style={{ width: '25%' }}>{server.ip}</label>
              <div style={{ width: '25%', display: 'flex', justifyContent: 'center' }}>
                <Tag color={server.online ? 'rgba(10, 138, 10, 1)' : 'red'}>{server.online ? 'ONLINE' : 'OFFLINE'}</Tag>
              </div>
              <label style={{ width: '25%' }}>{moment(server.lastUpdate).fromNow()}</label>
              {/*  <label style={{width:'25%'}}>{moment(server.lastChecked).fromNow()}</label> */}
              <div style={{ width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', gap: '10px' }}>


                <Button elStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', width: "50px", height: '40px' }} elClick={() => turnServerOn(server, index)}> <Image src='/power.svg' alt='' height={20} width={20} /></Button>
                <Button elStyle={{ width: "50px", height: '40px' }} elClick={() => forceCheckStatus(server, index)}> {server.loading ? <Loading /> : '↪'}</Button>


              </div>
            </div>
          })}
        </div>
      </main>


    </div>
  )
}
