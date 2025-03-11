import { ButtonHTMLAttributes, MouseEvent, PropsWithChildren } from "react";
import "./styles.css";

interface ButtonProps extends PropsWithChildren {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}
const PrimaryButton: React.FC<ButtonProps> = ({ children, disabled, onClick }) => {
  return (
    <button type="button" className="primary-button" disabled={disabled} onClick={(e) => onClick(e)}>
      {children}
    </button>
  );
};
export default PrimaryButton;
