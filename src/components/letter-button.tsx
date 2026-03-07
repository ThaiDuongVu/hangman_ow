interface LetterButtonProps {
  letter: string;
  disabled?: boolean;
  onClick: () => void;
}

const LetterButton = ({ letter, disabled, onClick }: LetterButtonProps) => {
  return (
    <button 
      type="button" 
      className={`btn m-1 ${disabled ? "btn-secondary" : "btn-outline-primary"}`} 
      onClick={onClick} disabled={disabled}>
      {letter.toUpperCase()}
    </button>
  )
}

export default LetterButton;