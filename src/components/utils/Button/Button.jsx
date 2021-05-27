import React from 'react'
import styles from './button.module.scss'


/**
 * @param {string}  classNames:  - defines button style and colors
 *    Colors: clean_white, clean, primary
 *  
 */

const Button = ({ className, onClick, disabled, type, children }) => {
  let buttonClasses = [styles.button]
  if (className) {
    const currentClasses = className.split(' ')
    currentClasses.forEach(type => {
      buttonClasses = [...buttonClasses, styles[type]]
    })
  }

  return (
    <button
      className={buttonClasses.join(' ')}
      onClick={() => onClick()}
      disabled={disabled}
      type={type ? type : 'button'}
    > {children}
    </button>
  )
}


export default Button