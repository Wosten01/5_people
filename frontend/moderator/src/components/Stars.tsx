import React, { useState } from "react";

interface StarRatingProps {
  totalStars: number;
  set: any;
}

const StarRating: React.FC<StarRatingProps> = ({ totalStars, set }) => {
  const [selectedStars, setSelectedStars] = useState<number>(0);

  const handleStarClick = (starIndex: number) => {
    setSelectedStars(starIndex + 1);
    set(starIndex + 1);
  };

  return (
    <div>
      {[...Array(totalStars)].map((_, index) => (
        <Star
          key={index}
          filled={index < selectedStars}
          onClick={() => handleStarClick(index)}
        />
      ))}
      <p>Вы выбрали: {selectedStars} звёзд(ы).</p>
    </div>
  );
};

interface StarProps {
  filled: boolean;
  onClick: () => void;
}

const Star: React.FC<StarProps> = ({ filled, onClick }) => {
  return (
    <span className={filled ? "star-filled" : "star-empty"} onClick={onClick}>
      &#9733;
    </span>
  );
};

export default StarRating;
