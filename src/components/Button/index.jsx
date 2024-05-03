import PropTypes from 'prop-types';

const Button = ({ text, onClick, type }) => {
  return (
    <button onClick={onClick} type={type}>
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.string
};

export default Button;
