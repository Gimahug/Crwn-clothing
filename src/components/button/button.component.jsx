/**
 * 通用按钮组件
 * 我们有三种类型的按钮：默认黑底hover变白；白底hover变黑； sign in按钮
 */
import './button.styles.scss';

const BUTTON_TYPE_CLASSES = {
  google: 'google-sign-in',
  inverted: 'inverted',
}

const Button = ({ children, buttonType, ...otherProps }) => {
  return (
    <button className={`button-container ${BUTTON_TYPE_CLASSES[buttonType]}`}>
      {children}
    </button>
  )
}
export default Button;