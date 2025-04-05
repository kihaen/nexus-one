import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import MapComponent from "@/components/MapComponent/MapComponent";
import { RatingComponent } from "@/components/Rating";
import placeholder from "../assets/placeholderImage.png";
import { PostState } from "../pages/p/[id]";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import Style from "../styles/Post.module.scss";
import { PostAction } from "../pages/p/[id]";
import MessageSmall from "@/components/MessageSmall";
import { Calendar } from "@/components/ui/calendar";
import { useSession } from "next-auth/react";
import Router from "next/router";

interface PostViewProps {
  state: PostState;
  props: any;
  postBelongsToUser: boolean;
  userHasValidSession: boolean;
  onEditClick: () => void;
  onPublishClick: (id: string) => void;
  dispatch: React.Dispatch<PostAction>;
}

const PostView: React.FC<PostViewProps> = ({
  state,
  props,
  postBelongsToUser,
  userHasValidSession,
  onEditClick,
  onPublishClick,
  dispatch,
}) => {
  const { data: session } = useSession();

  const submitData = async (message: string) => {
    try {
      const body = {
        title: state.title,
        content: message,
        messageReceipient: props.author.email,
        context: props.id,
      };
      await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setTimeout(() => {
        setMessageSent(true);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const galleryList = state.files.slice(1);

  const [messageSent, setMessageSent] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [selected, setSelected] = useState<{ from: Date; to: Date }>();

  return (
    <div className={Style.postOverviewPublic}>
      {postBelongsToUser && userHasValidSession && (
        <div className={Style.editHeader}>
          <h2>You are viewing your own post</h2>
          <div className={Style.actionGroup}>
            <button className={Style.editButton} onClick={onEditClick}>
              Edit Post
            </button>
            {!props.published && (
              <button onClick={() => onPublishClick(props.id)}>Publish</button>
            )}
          </div>
        </div>
      )}
      <div className={Style.postOverviewHeaderWrapper}>
        <h1>{state.title}</h1>
      </div>

      <div className={Style.galleryWrapper}>
        <div
          className={
            galleryList.length > 0 ? Style.mainImage : Style.mainImageSolo
          }
        >
          <Image
            src={state.files[0] || state.coverImg || placeholder}
            alt={state.title}
            width={1000}
            height={500}
          />
        </div>

        <div className={Style.galleryImage}>
          {galleryList.map((file, key) => {
            return (
              <Image
                src={file || state.coverImg || placeholder}
                alt={state.title}
                width={1000}
                height={500}
                key={key}
                onClick={() => {
                  dispatch({ type: "CHANGE_IMAGE", payload: key + 1 });
                }}
              />
            );
          })}
        </div>
      </div>
      {/* TODO : review!!! */}
      <div className={Style.postViewContent}>
        <div className={Style.postViewContentLeft}>
          <div className={Style.hostInfo}>
            {/* Room in hotel in Irving, Texas  --- some context on what this post image is*/}

            <div className={Style.rating}>
              <RatingComponent postId={props.id} />
            </div>
            <div className={Style.hostMinimunInfo}>
              <div className={Style.hostAvatar}>
                <Image
                  src={placeholder}
                  alt={props?.author.name}
                  width={48}
                  height={48}
                />
              </div>
              {/* Possible change posted by, context */}
              <p>posted by {props?.author.name}</p>
            </div>
          </div>

          <div className={Style.postDetails}>
            <h2>About this place</h2>
            <p>{state.description}</p>

            {state.content && (
              <>
                <h2>Description</h2>
                <ReactMarkdown>{state.content}</ReactMarkdown>
              </>
            )}

            <div className={Style.locationSection}>
              <div className={Style.locationWrapper}>
                <div className={Style.location}>
                  <FaMapMarkerAlt /> {state.location}
                </div>
              </div>
              {state.coordinates.length > 0 && (
                <div className={Style.mapContainer}>
                  <MapComponent
                    initialMarkers={[state.coordinates]}
                    zoom={16}
                    center
                    disableControls
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={Style.postViewContentRight}>
          <div className={Style.buttonGroup}>
            <Calendar
              className="flex justify-center rounded-md border shadow p-10px shadow-sm"
              mode="range"
              selected={selected}
              onSelect={(e: any) => {
                setSelected(e);
              }}
            />
            <button className={Style.bookingButton} onClick={() => {}}>
              Request Booking
            </button>
            {!postBelongsToUser && (
              <button
                className={Style.requestChatButton}
                onClick={() => {
                  session
                    ? setShowMessage((prev) => !prev)
                    : Router.push(`/auth/signin?callback=${window.location}`);
                }}
              >
                Contact Host
              </button>
            )}
            {showMessage && session && (
              <MessageSmall
                recepient={props?.author.name}
                showSuccess={messageSent}
                onClick={(message: string) => {
                  !messageSent && submitData(message);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostView;
