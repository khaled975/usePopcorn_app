import { useState } from "react";

const containerStyle = {
  display: "flex",
  alignItems: "center",
};
const starStyle = {
  width: "24px",
  color: "#fcc419",
};
export default function Star({ count, onSetRating }) {
  const [markedStar, setMarkedStar] = useState(0);
  const [tempStar, setTempStar] = useState(0);
  const onMarkedStars = (i) => {
    setMarkedStar((marked) => i);
    onSetRating(i);
    console.log(i);
  };

  const starsHover = (i) => {
    setTempStar((marked) => i);
    console.log(tempStar);
  };
  const onStarsLeave = () => {
    setMarkedStar(markedStar);
    setTempStar(0);
  };
  return (
    <>
      <div style={containerStyle} className="container">
        {Array.from({ length: count }, (_, s) => (
          <SingleStar
            key={s}
            onClick={() => onMarkedStars(s + 1)}
            onMouseEnter={() => starsHover(s + 1)}
            onMouseLeave={onStarsLeave}
            full={tempStar ? tempStar >= s + 1 : markedStar >= s + 1}
          />
        ))}
        <p>{tempStar || markedStar || ""}</p>
      </div>
    </>
  );
}

function SingleStar({ onClick, onMouseEnter, onMouseLeave, full }) {
  return (
    <span
      style={starStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      full={full}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="#fcc419"
          stroke="#fcc419"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#fcc419"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

/*
FULL STAR




EMPTY STAR

*/
