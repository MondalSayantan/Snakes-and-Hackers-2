import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { randomCodeGenerator } from "../utils/randomCodeGenerator";
import styled from "styled-components";
import axios from "axios";
import { endpoint } from "../App";
import dice from "../assets/dice.jpg";

const Create = () => {
  const navigate = useNavigate();
  // generate room code once per component mount
  const [roomCode] = useState(() => randomCodeGenerator(5));
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);
  const validateUrl = (value) => /https?:\/\/.+/i.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !url.trim()) {
      setError("Name, email and Amazon URL are required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validateUrl(url)) {
      setError("Please enter a valid Amazon URL (must start with http:// or https://).");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${endpoint}/api/amazon`, {
        amazonUrl: url,
      });
      if (response.status === 200) {
        localStorage.setItem("amazonTitle", response.data.title);
        localStorage.setItem("amazonPrice", response.data.price);
        localStorage.setItem("amazonImage", response.data.image);
        localStorage.setItem("amazonUrl", url);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        navigate(`/play?roomCode=${roomCode}`);
      } else {
        setError("Failed to fetch product details. Try another URL.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch product details. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // loading state reflected via button disabled text

  return (
    <>
      <Container>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="heading">
            <h1 className="text-3xl font-bold">Create Game</h1>
          </div>
          <input
            type="text"
            placeholder="Your Name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            min="3"
          />
          <input
            type="text"
            placeholder="Your Email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            min="3"
          />
          <input
            type="text"
            placeholder="Amazon URL"
            name="amazonUrl"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            min="3"
          />
          <button type="submit" id="submit-btn" disabled={loading}>
            {loading ? "Loading..." : "CREATE!"}
          </button>
          {error && <div style={{ color: "#ff6b6b" }}>{error}</div>}
          <span>
            Already have a room code? <Link to="/join">Join Room.</Link>
          </span>
        </form>
      </Container>
    </>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-image: url(${dice});
  .heading {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #131324;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    color: black;
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;

export default Create;
