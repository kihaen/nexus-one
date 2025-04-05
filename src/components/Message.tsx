import React, { useState } from "react";
import { useRouter } from "next/router";
import Style from "../styles/Message.module.scss";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { format } from "date-fns";

export type MessageProps = {
  id: string;
  title: string;
  content?: string;
  context?: string;
  date: string;
  messageAuthor: {
    name: string;
    email: string;
  };
  messageReceipient: {
    name: string;
    email: string;
  };
};

type Message = {
  message: MessageProps;
};

const Message = ({ message }: Message): JSX.Element => {
  const authorName = message.messageAuthor
    ? message.messageAuthor.name
    : "Unknown author";
  const recipientName = message.messageReceipient
    ? message.messageReceipient.name
    : "Unknown recipient";
  const formattedDate = format(new Date(message.date), "PPp"); // Format as "Apr 5, 2025, 12:00 PM"
  const router = useRouter();

  const [replyContent, setReplyContent] = useState("");
  const [showReplySection, setShowReplySection] = useState(false);

  async function replyMessage(id: string): Promise<void> {
    const replyPrefix = `Reply from ${authorName} on ${formattedDate}:\n\n`;
    const originalMessage = `\n\n*Original message from ${message.messageAuthor.name}:*\n *${message.content}* \n`;

    const body = {
      title: `Re: ${message.title}`,
      content: replyPrefix + replyContent + originalMessage,
      messageReceipient: message.messageAuthor.email,
      context: message?.context,
    };

    await fetch(`/api/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.replace(router.asPath);
    setShowReplySection(false);
  }

  async function deleteMessage(id: string): Promise<void> {
    await fetch(`/api/message/${id}`, {
      method: "DELETE",
    });
    router.replace(router.asPath);
  }

  return (
    <div className={Style.messageWrapper}>
      <div className={Style.messageHeader}>
        <h2>{message.title}</h2>
        <div className={Style.messageActionWrapper}>
          <button
            onClick={() => {
              setShowReplySection((prev) => !prev);
            }}
          >
            {!showReplySection ? "Reply" : "Hide Reply"}
          </button>
          <button
            onClick={() => {
              deleteMessage(message.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <div className={Style.messageDetails}>
        <div className={Style.messageAuthors}>
          <div>
            From: <span className={Style.authorName}>{authorName}</span>
          </div>
          <div>
            To: <span className={Style.recipientName}>{recipientName}</span>
          </div>
        </div>
        <time dateTime={message.date}>{formattedDate}</time>
        <Link
          className={Style.messageContext}
          href={message.context ? `/p/${message.context}` : "/inbox"}
        >
          <small>Original Post</small>
        </Link>
      </div>

      <div className={Style.postContent}>
        <ReactMarkdown>{message?.content || ""}</ReactMarkdown>
      </div>

      {showReplySection && (
        <>
          <div className={Style.line} />
          <div className={Style.replySection}>
            <textarea
              className={Style.postReplyContent}
              placeholder="Write your reply here..."
              value={replyContent}
              onChange={(e) => {
                setReplyContent(e.target.value);
              }}
            />
            <button
              className={Style.button}
              onClick={() => replyMessage(message.id)}
              disabled={!replyContent.trim()}
            >
              Send Reply
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Message;
