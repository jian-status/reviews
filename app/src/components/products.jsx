import {useParams, useNavigate, replace} from 'react-router-dom';
import { useEffect, useState } from 'react';
import RatingSystem from './RatingSystem.jsx';

import styles from './products.module.css';

export function SubmitReview() {
    const [errorMessage, setErrorMessage] = useState('');
    const { productId } = useParams();
    const [product, setProduct] = useState({});

    // review
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(''); // photo or video
    const [userData, ,setUserData] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/products/' + productId, {credentials: 'include'})
        .then(res => {
            if (res.status == 401) {
                return Promise.reject("User is not logged in.");
            }
            return res.json();
        })
        .then(data => {
            setProduct(data);
        })
        .catch(err => {
            navigate('/', { replace: true});
            console.log(err);
        })

        fetch('http://localhost:3000/auth/aboutUser', {credentials: 'include'})
        .then((res) => res.json())
        .then(data => setUserData(data));

    }, [])

    async function handleSubmit(event) {
        event.preventDefault();

        if (rating < 1) return setErrorMessage('Please enter a valid rating!');
        if (file) { } // DO SOMETHING

        fetch('http://localhost:3000/reviewsFor/' + productId, {
            method: 'POST',
            credentials: 'include',
            body: new URLSearchParams({
                reviewer_id: userData.id,
                reviewer_username: userData.username,
                title: title,
                description: description,
                stars: rating,
                product_id: productId,
            })
        }).then(() =>navigate('/', {replace: true})) // on success, return to home
    }
    return (
        <div className="mx-auto w-[50vw] shadow p-10 mt-5">
            {errorMessage ? <p className="text-red-400 text-xl font-light">{errorMessage}</p> : ''}
            <h2>Create Review</h2>
            <div>
                <h3>You are reviewing</h3>
                <p>{product.name} - {product.brand}</p>
            </div>
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <RatingSystem rating={rating} setRating={setRating}/>
                <div>
                    <h3>Add a headline</h3>
                    <label>
                        <input
                            placeholder="What should people know?"
                            className="w-full h-8 border border-black"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <h3>Add a photo or video</h3>
                    <p>Shoppers find images and videos more helpful than text alone.</p>
                    <label>
                        <input
                            type="file"
                            value={file}
                            onChange={(e) => setFile(e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <h3>Add a written review</h3>
                    <label>
                        <textarea
                            placeholder="Describe your experience: first impressions, surprises, or overall impression"
                            className="w-full h-32 text-left align-top border border-black"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button className="font-bold border border-black p-1 rounded mt-2 w-1/2 mx-auto">Submit</button>
            </form>
            <p className="mx-auto max-w-max mt-3">Your review may be pending while admins approve your review.</p>
        </div>
    )
}

export function DisplayReviews() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [ reviews, setReviews ] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/reviewsFor/' + productId,
            {credentials: 'include'}
        )
            .then(res => {
                if (res.status == 401) {
                    return Promise.reject("User is not logged in.");
                }
                return res.json();
            })
            .then(data => {
                data.length ? setReviews(data) : null;
            })
            .catch(err => {
                console.log(err);
                navigate('/', { replace: true});
            })
    }, [])
    return (
        <div
            className="p-3"
        >
            {reviews ? reviews.map((review, mapIndex) =>
                <p key={mapIndex}>
                    <h3>{review.title}</h3>
                    <p>{review.description}</p>
                    <p>{review.reviewer_username}</p>

                </p>
            ) : 'No reviews found for this product'}
        </div>
    )
}