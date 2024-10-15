import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";

// ☆ ⭐
export function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault()
        await fetch('http://localhost:3000/auth', {
            method: 'POST',
            headers: {
                'Content-type': 'application/JSON',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            credentials: 'include', // https://github.com/jaredhanson/passport/issues/570#:~:text=So%20for%20it%20to%20work%20you%20need%20set%20credentials%3A%20include%20while%20both%20receiving%20and%20sending%20the%20cookies.
        })
        .then(() => {
            navigate(0);
        })
    }
    return (
        <div className="size-72 flex flex-col items-center justify-center m-auto">
            <h1 className="text-2xl">Sign in </h1>
            <form onSubmit={handleLogin}> {/* onSubmit={handleLogin} */}
                <section>
                    <label htmlFor="username">Username:{' '}</label>
                    <input
                        id="username"
                        name="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        type="text"
                        autoComplete="username"
                        required
                        autoFocus
                        className="border border-black rounded w-full"
                    />
                </section>
                <section>
                    <label htmlFor="current-password">Password: {' '}</label>
                    <input
                        id="current-password"
                        name="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                        className="border border-black rounded w-full"

                    />
                </section>
                <button type="submit">Sign in →</button>
            </form>
            <p>Are you a new visitor? <Link to="register" className="underline">Register here.</Link></p>
        </div>
    )
}

export function SignUpForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                first_name: firstName,
                last_name: lastName,
                email: email,
            })
        })
        .then(() => {
        })
        .catch(err => console.log(err));
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <label>First name *
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                </label>
                <label>Last name
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}/>
                </label>
                <label>Email *
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)}/>
                </label>
                <label>Username *
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
                </label>
                <label>Password *
                    <input type="text" value={password} onChange={e => setPassword(e.target.value)}/>
                </label>
                <button type="submit">Submit</button>
            </form>
        </>
    )
}
