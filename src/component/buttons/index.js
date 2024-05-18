import classNames from "classnames/bind";
import styles from "./Button.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);
function Button({ 
  to, 
  href, 
  children, 
  onClick, 
  login = false, 
  backLogin = false, 
  detail = false, 
  approve_btn = false, 
  delete_btn = false, 
  forget_btn = false 
}) {
  let Comp = "button";

  const props = {
    onClick,
  };

  if (to) {
    props.to = to;
    Comp = Link
  } else if (href) {
    props.href = href;
    Comp = 'a'
  }

  const classes = cx("wrapper", {
    login,
    backLogin,
    detail,
    approve_btn,
    delete_btn,
    forget_btn
  });

  return (
    <Comp className={classes} {...props}>
      <span>{children}</span>
    </Comp>
  );
}

export default Button;
