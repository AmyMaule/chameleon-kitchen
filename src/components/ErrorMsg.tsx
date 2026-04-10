type ErrorMsgProps = {
  message: string;
};

const ErrorMsg = ({ message }: ErrorMsgProps) => {
  return (
    <div className="recipe-error-container">
      <h6 className="recipe-error-text">{message}</h6>
    </div>
  );
};

export default ErrorMsg;
