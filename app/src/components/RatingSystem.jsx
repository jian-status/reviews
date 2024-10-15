import {useState} from 'react';

export default function RatingSystem({ rating, setRating }) {
    const [hoverRating, setHoverRating] = useState(-1);
    return (
        <label>
            <h3>Overall rating</h3>
            {[1, 2, 3, 4, 5].map(index =>
                <label
                    key={index}
                    title={index + ' star'}
                    onMouseEnter={() => setHoverRating(index)}
                    onMouseLeave={() => setHoverRating(-1)}
                    onClick={() => setRating(index)}
                >
                    {index <= hoverRating ? '⭐' : (hoverRating !== -1 ? '☆': (index <= rating ? '⭐' : '☆'))}
                    <input type="radio" name="rating" value={index} className="hidden"/>
                </label>
            )}
        </label>
    )
}