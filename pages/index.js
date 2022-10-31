import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { io } from 'socket.io-client'
import {useState, useLayoutEffect} from 'react'
import useDate from '../hooks/useDate'
import moment from 'moment'
const socket = io('http://localhost:5001')

export default function Home() {
  const [servers, setServers] = useState([])


  useLayoutEffect(() => {
    socket.on('update-status', (servers) => {
      setServers(servers);
    });


    return () => {
      socket.off('update-status');
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
        <h1>
          Servers
        </h1>

        <div className={styles.ServersContainer}>
            {servers.map((server, index) =>{
              return <label key= {index}> {server.label} - {server.ip} - <label style={server.online ? {color:'green'} : {color:'red'}}>{server.online ? 'Online' : 'Offline'}</label> {moment(server.lastUpdate).fromNow()}</label>
            })}
        </div>
      </main>

      
    </div>
  )
}
