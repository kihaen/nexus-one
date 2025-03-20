import {Card, CardHeader, Text ,Heading, CardBody,  Box,  CardFooter, Button, Portal} from "@chakra-ui/react";
import {EmailIcon, CheckIcon} from "@chakra-ui/icons";
import {useState} from "react"

 const MessageSmall = ({recepient = "", onClick, showSuccess} : {recepient? : string, onClick? : (msg : string)=> void, showSuccess : boolean})=> {
    const [message, setMessage] = useState<string>("");
    return (
        <Card maxW='lg' minWidth="sm"  boxShadow={"0 .0625rem .125rem 0 rgba(0, 0, 0, .3), 0 .0625rem .1875rem .0625rem rgba(0, 0, 0, .15)"}>
            <CardHeader>
                <Box>
                <Heading size='sm'>Contact Poster</Heading>
                <Text>To : {recepient}</Text>
                </Box>
            </CardHeader>
            <CardBody minWidth={"sm"} >
                <Text fontWeight={"700"}>Message</Text>
                <textarea style={{width:"100%", padding : "10px", border : "solid 1px #949494", marginTop : "10px", minHeight : "100px"}} disabled={showSuccess} value={showSuccess ? "Message Sent!" : message} onChange ={(e)=>{
                    setMessage(e.target.value)
                }} />
            </CardBody>
            <CardFooter
                justify='space-between'
                flexWrap='wrap'
                sx={{
                '& > button': {
                    minW: '156px',
                },
                }}
            >
                <Button flex='1' variant='ghost' leftIcon={showSuccess ? <CheckIcon color={"green"}/> : <EmailIcon />} onClick={()=> {
                    onClick?.(message)
                }}>
                {showSuccess ? "Sent" : "Send"}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default MessageSmall;