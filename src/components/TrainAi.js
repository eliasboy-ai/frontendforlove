// src/components/TrainAI.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './TrainAi.css';
import config from './config';

function TrainAI() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [loadingNextQuestion, setLoadingNextQuestion] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        if (decodedToken.sub && decodedToken.sub.user_id) {
          setUserId(decodedToken.sub.user_id);
          console.log('Decoded user ID:', decodedToken.sub.user_id);
        } else {
          console.error('user_id not found in token');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('No token found');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchQuestions = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.post(`${config.apiUrl}/generate_questions`, { user_id: userId }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          console.log('Fetched questions data:', response.data);
          setQuestions(response.data.questions);
          if (response.data.questions.length > 0) {
            setCurrentQuestion(response.data.questions[0]);
          }
        } catch (error) {
          console.error('Error fetching questions:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    } else {
      console.log('User ID not set');
      setLoading(false);
    }
  }, [userId]);

  if (loading || loadingNextQuestion) {
    return <div>Loading questions...this can take a minute ._.</div>;
  }

  const handleResponseSubmit = async (e) => {
      e.preventDefault();
      try {
          const token = localStorage.getItem('token');
          await axios.post(`${config.apiUrl}/save_ai_response`, {
              question: currentQuestion,
              response: response
          }, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });

          setMessage('Response saved successfully');
          setLoadingNextQuestion(true);
          setResponse(''); // Clear the response field

          // Nach dem Absenden der Antwort eine neue Frage generieren
          const fetchQuestion = async () => {
              try {
                  const token = localStorage.getItem('token');
                  const response = await axios.post(`${config.apiUrl}/generate_questions`, {}, {
                      headers: {
                          'Authorization': `Bearer ${token}`
                      }
                  });
                  console.log('Fetched question:', response.data);
                  if (response.data.questions.length > 0) {
                      setCurrentQuestion(response.data.questions[0]);
                  } else {
                      setCurrentQuestion('No question generated. Please try again later.');
                  }
                  setMessage(''); // Clear the message after loading new question
              } catch (error) {
                  console.error('Error fetching question:', error);
              } finally {
                  setLoadingNextQuestion(false);
              }
          };

          fetchQuestion();
      } catch (error) {
          console.error('Error saving response:', error);
          setMessage('Error saving response. Please try again.');
      }
  };


  return (
    <div className="train-ai-container">
      <h2>Train Your AI</h2>
      {currentQuestion ? (
        <form onSubmit={handleResponseSubmit}>
          <div className="question">
            <p>{currentQuestion}</p>
          </div>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your answer here..."
            required
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Loading questions...this can take a minute ._.</p>
      )}
    </div>
  );
}

export default TrainAI;
