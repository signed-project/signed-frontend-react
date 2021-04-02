import React from 'react'
import styles from './button.module.scss'
/* 
  Button class names: 
  Sizes: tiny, small
  Colors: clean_white, clean, red, secondary, primary
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
      onClick={onClick}
      disabled={disabled}
      type={type ? type : 'button'}
    > {children}
    </button>
  )
}


export default Button