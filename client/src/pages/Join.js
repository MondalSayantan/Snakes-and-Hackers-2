import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { endpoint } from "../App";
import dice from "../assets/dice.jpg";

const Join = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (url && roomCode) {
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
          setLoading(false);
          navigate(`/play?roomCode=${roomCode}`);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please enter a valid URL");
    }
    setLoading(false);
  };

  if (loading) {
    document.getElementById("submit-btn").innerText = "Loading...";
  }

  return (
    <>
      <Container>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="heading">
            <h1 className="text-3xl font-bold">Join Game</h1>
          </div>
          <input
            type="text"
            placeholder="Room Code"
            name="roomCode"
            onChange={(event) => setRoomCode(event.target.value)}
            min="3"
          />
          <input
            type="text"
            placeholder="Your Name"
            name="name"
            onChange={(event) => setName(event.target.value)}
            min="3"
          />
          <input
            type="text"
            placeholder="Your Email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            min="3"
          />
          <input
            type="text"
            placeholder="Amazon URL"
            name="amazonUrl"
            onChange={(event) => setUrl(event.target.value)}
          />
          <button type="submit" id="submit-btn">
            Join!
          </button>
          <span>
            Don't have a room code? <Link to="/create">Create One.</Link>
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

export default Join;
