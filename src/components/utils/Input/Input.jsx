import styles from './input.module.scss';


const Input = ({ title, type, value, handleChange, name, placeholder }) => {

    return (
        <div className={styles.formItem}>
            <p className={styles.title}>
                {title}
            </p>
            <input
                type="text"
                type={type}
                className={styles.input}
                value={value}
                onChange={(e) => handleChange(e)}
                name={name}
            />

        </div >
    )
}

export default Input;