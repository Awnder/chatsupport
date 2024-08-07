'use client'

import { Box, Stack, TextField, Button, Typography } from "@mui/material"
import { useState } from "react";

export default function Home() {
  const [history, setHistory] = useState([
    // {
    //   role: "model",
    //   content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    // },
  ])
  const firstMessage = "Hi there! I'm the Headstarter virtual assistant. How can I help?"
  
  const [message, setMessage] = useState("")

  const sendMessage = async () => {
    setHistory((history) => [ ...history, {role: "user", parts: [{text: message}]} ])
    setMessage('')

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify([ ...history, {role: "user", parts: [{text: message}]} ])
    })

    const data = await response.json()

    setHistory((history) => [ ...history, {role: "model", parts: [{text: data}] }])
  }

  return (
    <Box
      width={'100vw'}
      height={'100vh'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Stack 
        direction={'column'} 
        justifyContent={'flex-end'}
        width={'50%'} 
        height={'80%'} 
        maxHeight={'80%'} 
        border={'2px solid black'} 
        borderRadius={5}
        
        spacing={3}
      >
        <Stack direction={'column'} spacing={2} overflow={'auto'} mb={2}>
          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            bgcolor={'secondary.main'}
            borderRadius={10}
            p={2}
          >
            <Typography
              bgcolor={'secondary.main'}
              color={'white'}
            >
              {firstMessage}
            </Typography>
          </Box>
          {history.map((textObject, index) => (
            <Box
              key={index}
              display={'flex'}
              justifyContent={textObject.role === 'user' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={textObject.role === 'user' ? 'primary.main' : 'secondary.main'}
                color={'white'}
                borderRadius={10}
                p={2}
              >
                {textObject.parts[0].text}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2} width={'80%'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <TextField label='Message' value={message} onChange={(e => setMessage(e.target.value))} fullWidth></TextField>
          <Button variant='contained' onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}

  // const generateText = async () => {
  //   try {
  //     // use fetch to send http request
  //     const response = await fetch("/api/chat", {
  //       method: "POST",
  //       headers: { "Content-Type":"application/json", },
  //       body: JSON.stringify({ body: prompt })
  //     })

  //     // waits for response to convert to json and stores
  //     const data = await response.json()

  //     if (response.ok) {
  //       setMessage(data.message)
  //     } else {
  //       setMessage(data.error)
  //     }
  //   } catch (error) {
  //     console.error("Error:", error)
  //   }
  // }
