import Checkbox from '../../utils/Checkbox/Checkbox';
import style from './newPost.module.scss';
import Avatar from '../../utils/Avatar/Avatar';
import InfoAuthor from '../../utils/InfoAuthor/InfoAuthor';

const ReplyingUser = ({ name, avatar, checked, checkBoxName, onChange }) => {
    return (
        <div className={style.authorRow}>
            <div className={style.authorInfoBlock}>
                <Avatar avatar={avatar} />
                <InfoAuthor name={name} />
            </div>
            <div className={style.checkboxWrapper}>
                <Checkbox
                    onChange={onChange}
                    isChecked={checked}
                    name={checkBoxName}
                />
            </div>
        </div>
    )
}

export default ReplyingUser;