import React from 'react';
import checkedImg from 'assets/images/checked-circle.svg';
import uncheckedImg from 'assets/images/unchecked-circle.svg';

function Checkbox({ className, children, checked, onChange }) {
  return (
    <div
      className={`checkbox unselectable link row align-start max-width ${className}`}
      onClick={onChange}
    >
      <img className="top-5" src={checked ? checkedImg : uncheckedImg} alt="" />
      <p className="lighter-grey left-10 col grow">{children}</p>
    </div>
  );
}

export default Checkbox;
