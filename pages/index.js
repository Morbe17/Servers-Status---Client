import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { io } from 'socket.io-client'
import {useState, useLayoutEffect, useEffect} from 'react'
import moment from 'moment'
import Tag from '../src/components/Tag'

export default function Home() {
  const [servers, setServers] = useState([])
  const [offlineServers, setOfflineServers] = useState(0)

  useEffect(() => {
    const socket = io('http://localhost:5001')

    socket.on('update-status', (servers) => {
      let count = 0
      servers.sort((a, b) =>{
        if(!a.online){
          return -1
        }

        if(!b.online){
          return 1
        } 

        return 0
      })
      servers.forEach((el) => {
        if (!el.online) count++
      });
      setOfflineServers(count)
      setServers(servers);
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
        <h1>Servers🖥</h1>
        <h3>Offline ({offlineServers}) </h3>

        <div className={styles.ServersContainer}>

              
            {servers.map((server, index) =>{
              return <div key= {index} className={styles.ServerList}> 
                <label style={{width:'25%'}}>{server.label}</label> 
                <label style={{width:'25%'}}>{server.ip}</label> 
                <Tag color={server.online ? 'green' :'red'}>{server.online ? 'ONLINE' : 'OFFLINE'}</Tag> 
                <label style={{width:'25%'}}>{moment(server.lastUpdate).fromNow()}</label>
              </div>
            })}
        </div>
      </main>

      
    </div>
  )
}
