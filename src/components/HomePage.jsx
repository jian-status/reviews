import { useEffect, useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { DisplayReviews } from "./products.jsx";

const ACCOUNT_PRIVILEGES = {
    "admin":
        "As an admin, you are able to accept or deny pending reviews " +
        "and delete reviews after they are approved!",
    "superadmin": "As a superadmin, you can add, remove, or delete accounts! " +
        "You are also able to accept or deny pending reviews and delete " +
        "reviews after they are approved",
    "seller": "As a seller, you can only add or remove your own products! " +
        "You may not leave reviews",
    "user": "As a user, you can only add or remove your own reviews!"
}

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState([]);

    const navigate = useNavigate();
    const PRIVILEGES = ACCOUNT_PRIVILEGES[userData.type];

    useEffect(() => {
        fetch('http://localhost:3000/products', {credentials: "include"})
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setIsLoading(false);
            });

        fetch('http://localhost:3000/auth/aboutUser', {credentials: 'include'})
            .then((res) => res.json())
            .then(data => setUserData(data));
    }, [])

    async function LogOut() {
        await fetch('http://localhost:3000/logout', {method: "POST", credentials: 'include'}).then(() => navigate(0));
    }

    return (
        <>
            {isLoading ? 'Loading!' : (
                <div className="p-7 mx-auto max-w-max shadow-2xl">
                    <div>
                        <p className="font-bold text-lg"> {`Welcome, ${userData.username}! You're logged in!`}</p>
                        <p>{PRIVILEGES}</p>
                        <button
                            className="border border-black rounded p-1"
                            onClick={() => LogOut()}
                        >
                            Log Out
                        </button>
                    </div>
                    <h1 className="text-3xl font-bold mt-5">
                        Products
                    </h1>
                    <p>
                        <select
                            className="border border-black"
                        >
                            <option>No filter</option>
                            <option>Filter by products you have reviewed</option>
                            <option>Filter by products you have not yet reviewed</option>
                        </select>
                    </p>
                    <ol className="list-decimal list-inside">
                        {products.map((product, mapIndex) =>
                            <li key={mapIndex} className="mt-5 border border-black p-3 rounded-lg pb-5">
                                {product.name} - {product.brand} - {product.released.substring(0, product.released.indexOf('T'))}
                                <ol className="list-item list-inside ml-10">
                                    <li>
                                        <p className="mb-1.5">{product.description}</p>
                                        <label className="ml-10">
                                            Options:
                                            <Link
                                                to={'/reviewing/' + product.id}
                                                className="ml-1 border border-black p-1 rounded"
                                            >Review</Link>
                                            <Link
                                                to={'/reviews/' + product.id}
                                                className="ml-1 border border-black p-1 rounded"
                                            >Display Reviews</Link>
                                        </label>
                                    </li>
                                </ol>
                            </li>
                        )}
                    </ol>
                </div>
            )}
        </>
    )
}