import React from "react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { isValidURL } from "@/utility/util";
import MapComponent from '@/components/MapComponent/MapComponent';
import placeholder from "../assets/placeholderImage.png";
import { PostState } from "../pages/p/[id]"
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import Style from "../styles/Post.module.scss";

interface PostViewProps {
  state: PostState;
  props: any;
  postBelongsToUser: boolean;
  userHasValidSession: boolean;
  onEditClick: () => void;
  onPublishClick: (id: string) => void;
  onMessageClick: () => void;
}

const PostView: React.FC<PostViewProps> = ({
  state,
  props,
  postBelongsToUser,
  userHasValidSession,
  onEditClick,
  onPublishClick,
  onMessageClick
}) => {
  return (
    <div className={Style.postOverviewPublic}>
      <div className={Style.postOverviewHeaderWrapper}>
        <h1>{state.title}</h1>
        {postBelongsToUser && userHasValidSession && (
          <div className={Style.buttonGroup}>
            <button onClick={onEditClick}>
              Edit Post
            </button>
            {!props.published && (
              <button onClick={() => onPublishClick(props.id)}>Publish</button>
            )}
          </div>
        )}
      </div>

      <div className={Style.imageGallery}>
        <div className={Style.mainImage}>
          <Image 
            src={isValidURL(state.coverImg) ? state.coverImg : placeholder} 
            alt={state.title} 
            width={1000} 
            height={500}
          />
        </div>
      </div>

      <div className={Style.hostInfo}>
        <div className={Style.hostAvatar}>
          <Image src={placeholder} alt={props?.author.name} width={48} height={48} />
        </div>
        <div>
          <p>Hosted by {props?.author.name}</p>
          <div className={Style.rating}>
            <FaStar /> 5.0 · Spectacular
          </div>
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
              />
            </div>
          )}
        </div>
      </div>

      {!postBelongsToUser && (
        <div className={Style.buttonGroup}>
          <button onClick={onMessageClick}>
            Contact Host
          </button>
        </div>
      )}
    </div>
  );
};

export default PostView;