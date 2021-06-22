import styles from './input.module.scss';


const Input = ({ title, type, value, handleChange, name, placeholder, warning }) => {

    return (
        <div className={styles.formItem}>
            <div className={styles.title}>
                <span>{title}</span>
                <span>{warning && <span className={styles.title_warning}>{warning}</span>}</span>
            </div>

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