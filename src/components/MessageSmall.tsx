import { useState } from "react";
import { Mail, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageSmallProps {
  recepient?: string;
  onClick?: (msg: string) => void;
  showSuccess: boolean;
}

const MessageSmall = ({ recepient = "", onClick, showSuccess }: MessageSmallProps) => {
  const [message, setMessage] = useState<string>("");

  return (
    <Card className="max-w-lg min-w-sm shadow-[0_0.0625rem_0.125rem_0_rgba(0,0,0,0.3),0_0.0625rem_0.1875rem_0.0625rem_rgba(0,0,0,0.15)]">
      <CardHeader>
        <div>
          <CardTitle className="text-sm">Contact Poster</CardTitle>
          <CardDescription>To: {recepient}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="min-w-sm">
        <p className="font-bold">Message</p>
        <Textarea
          className="w-full p-2.5 border border-gray-400 mt-2.5 min-h-25"
          disabled={showSuccess}
          value={showSuccess ? "Message Sent!" : message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-between flex-wrap gap-2">
        <Button
          variant="ghost"
          className="flex-1 min-w-39"
          onClick={() => onClick?.(message)}
        >
          {showSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Sent
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MessageSmall;