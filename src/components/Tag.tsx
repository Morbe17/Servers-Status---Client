import React from 'react'
import styles from'../../styles/Home.module.css'

const Tag = (props: any) => {
  return (
    <div style={{backgroundColor:props.color}} className={styles.Tag}>
        <label>
            {props.children}
        </label>
    </div>
  )
}

export default Tag