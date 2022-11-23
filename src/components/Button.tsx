import React from 'react'
import { motion } from 'framer-motion'
import Styles from '../../styles/Home.module.css'

const Button = (props: { elClick: Function, children: any, elStyle: Object }) => {
    return (
        <motion.button
            onClick={(e) => props.elClick(e)}
            className={Styles.ActionButton}
            style={props?.elStyle || {}}
            whileHover={{ scale: 1.1, cursor:'pointer' }}
            whileTap={{ scale: 0.9 }}
        >
            {props.children}
        </motion.button>
    )
}

export default Button