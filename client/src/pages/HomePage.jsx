import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import Header from "../components/Header";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { chatCompletion } from "../api/chat.api";
import { toast } from "react-toastify";
import TypeWriter from "typewriter-effect";
import Loading from "./../components/Loading";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Stack, Box, Typography, IconButton, FormControl, OutlinedInput, CircularProgress,NativeSelect } from "@mui/material";
import { Rating } from 'react-simple-star-rating';
const messageType = {
  answer: "answer",
  question: "question"
};

const HomePage = () => {

  const [ratingValue, setRatingValue] = useState(0);

  const handleRating = (rate) => {
    setRatingValue(rate);
  }
  




  const username = localStorage.getItem("username");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const inputRef = useRef();
  const chatWrapperRef = useRef();

  const [onRequest, setOnRequest] = useState(false);
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("Chat");
  const [messages, setMessages] = useState([]);
  const getAnswer = async () => {
    
    if (onRequest) return;
    
    const newMessages = [...messages, {
      type: true,
      content: question,
      answertype: type
    }];
    setMessages(newMessages);
    setQuestion("");
    setOnRequest(false);

    const { response, err } = await chatCompletion({ prompt: question,Type: type });

    if (response) {
      console.log(response.type);
      setMessages([...newMessages, {
        type: false,
        content: response.response,
        answertype: response.type
      }]);
      console.log(newMessages[0]);
    }
    // setIsLoading(false);

    if (err) {
      toast.error(err.message);
      setOnRequest(false);
    }
  };

  const onEnterPress = (e) => {
    // setIsLoading(true);
    if (e.keyCode === 13) getAnswer();
  };

  const onSignOut = () => {
    localStorage.removeItem("tkn");
    navigate("/signin");
  };

  useEffect(() => {
    setTimeout(() => {
      chatWrapperRef.current.addEventListener("DOMNodeInserted", e => {
        e.currentTarget.scroll({
          top: e.currentTarget.scrollHeight,
          behavior: "smooth"
        });
      });
    }, 200);
  }, []);

  return (
    !isLoading ? (
      <Loading />
    ) :(
    <Stack
      alignItems="center"
      justifyContent="space-between"
      sx={{ height: "100%" }}
    >
      <Header bg borderBottom>
        <Box sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          paddingX: 2,
          maxWidth: "md"
        }}>

          <Typography
            variant="h6"
            fontWeight="700"
            sx={{
              position: "absolute", 
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            {username}
          </Typography>
          <Typography variant="h6"
            fontWeight="700"
            sx={{
              position: "absolute", 
              top: "50%",
              left: "5%",
              transform: "translate(-50%, -50%)"
            }} >
              <NativeSelect
                defaultValue={30}
                inputProps={{
                  name: 'control',
                  id: 'uncontrolled-native',
                }}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Chat">Chat</option>
                <option value="Text to image">Text to image</option>
                <option value="Image to text">Image to text</option>
                <option value="Text to video">Text to video</option>
                <option value="Video to text">Video to text</option>
                
              </NativeSelect>
              
              </Typography>

          <IconButton
            onClick={onSignOut}
            sx={{
              position: "absolute",
              top: "50%",
              right: "16px",
              transform: "translateY(-50%)"
            }}
          >
            <LogoutOutlinedIcon />
          </IconButton>
        </Box>
      </Header>
              
      <Box ref={chatWrapperRef} sx={{
        height: "100%",
        position: "fixed",
        zIndex: 1,
        maxWidth: "md",
        width: "100%",
        overflowY: "auto",
        paddingTop: "60px",
        paddingBottom: "90px",
        "&::-webkit-scrollbar": {
          width: "0px"
        }
      }}>
        <p>   </p>
    {/* <video controls width="100%">
      <source src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" type="video/mp4" />
      Sorry, your browser doesn't support embedded videos.
    </video> */}
        


        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          maxWidth: "md",
          width: "100%"
        }}>
          
          {messages.map((item, index) => (
            
            <Box sx={{
                   padding: 2,
                  //  bgcolor: item.type === messageType.answer && "#2f2f2f",
                    bgcolor: item.type === false && "#2f2f2f",
                   borderRadius: 3
                 }} > 
                 {/* <video controls width="100%">
      <source src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" type="video/mp4" />
      Sorry, your browser doesn't support embedded videos.
    </video> */}
                 
                {item.type === true?
                  (<div>{item.content}</div>):(null)}
                {item.answertype === "Chat"&& item.type === false?
                (<div><div>{item.content}</div><Rating onClick={handleRating} initialValue={ratingValue} /></div>):(null)}
                {item.answertype === "Image"&& item.type === false?
                (<div><div><img src={item.content}/>
                </div><Rating onClick={handleRating} initialValue={ratingValue} /></div>):(null)}
                {item.answertype === "Video"&& item.type === false?
                (<div><video controls width="100%">
                <source src={item.content} type="video/mp4" />
                Sorry, your browser doesn't support embedded videos.
              </video><Rating onClick={handleRating} initialValue={ratingValue} /></div>):(null)}
                
                    
                 {/* {item.answertype === "Chat"?item.content.split("\n").map((item,index) => (
                    <div>{item.trim()}</div>
                 )):<div><img src={item.content}/></div>}
                  */}
            </Box>                 
          ))}
        </Box>



        
      </Box>

   



      <Stack
        width="100%"
        alignItems="center"
        justifyContent="center"
        borderTop="1px solid #2c2c2c"
        bgcolor="#000"
        zIndex={3}
      >


        

        <Box
          padding={2}
          width="100%"
          maxWidth="md"
        >


          
          <FormControl fullWidth variant="outlined">
            <OutlinedInput
              inputRef={inputRef}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none"
                }
              }}
              endAdornment={
                onRequest ? (
                  <CircularProgress size="1.5rem" />
                ) : (
                  <SendOutlinedIcon />
                )
              }
              autoFocus
              disabled={onRequest}
              onKeyUp={onEnterPress}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something..."
            />
            {/* <RatingComponent/> */}
          </FormControl>

        </Box>
        
      </Stack>
      
    </Stack>)
  );
};

export default HomePage;