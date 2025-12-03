import React, { useState } from 'react'


const Home = () => {
    // useState, Display Text, Button, On Click
    const [text, setText] = useState("Aloha! Welcome to da Ohana!");
    const [count, setCount] = useState(0);
    const description = "This is the main landing page of our web application.";

    const handleClick = () => {
        setText("Aloha! You clicked the button!");
    }
    return (
        <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{ 
                fontSize: '2.5rem', 
                marginBottom: '1rem',
                color: '#333'
            }}>
                {text}
            </h1>
            <p style={{ 
                fontSize: '1.2rem', 
                marginBottom: '2rem',
                color: '#666'
            }}>
                {description}
            </p>
            <div style={{ 
                marginBottom: '2rem',
                padding: '1.5rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                minWidth: '300px'
            }}>
                <p style={{ 
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#2c3e50'
                }}>
                    {text}
                </p>
            </div>
            <button onClick={handleClick}
            style={{ 
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                margin: '0.5rem',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#535bf2'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#646cff'}
            >
                {text}
            </button>
        
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>More clicks</button>
        <button onClick={() => setCount(count - 1)}>Less clicks</button>
        <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
};
export default Home;