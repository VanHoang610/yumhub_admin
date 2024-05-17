import styles from './header.module.scss';
import classNames from 'classnames';

const cx = classNames.bind(styles);
function header(){
    return <header className={cx('wrapper')}>header</header>

}

export default header;