import React, { useEffect } from "react";
import MapComponent from "@/components/MapComponent/MapComponent";
import { NominatimReverseResponse } from "@/utility/util";
import { PostState, PostAction } from "../pages/p/[id]";
import Style from "../styles/Post.module.scss";
import useImageToBase64 from "@/hooks/useImageToBase64";
import { FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

interface PostEditProps {
  state: PostState;
  props: any;
  userHasValidSession: boolean;
  postBelongsToUser: boolean;
  isLoading?: boolean;
  onSaveClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
  onCancelClick: () => void;
  onPublishClick: (id: string) => void;
  onMapClick: (
    click: Promise<NominatimReverseResponse>,
    coords: number[] | undefined
  ) => void;
  dispatch: React.Dispatch<PostAction>;
}

const PostEdit: React.FC<PostEditProps> = ({
  state,
  props,
  userHasValidSession,
  postBelongsToUser,
  onSaveClick,
  onDeleteClick,
  onCancelClick,
  onPublishClick,
  onMapClick,
  dispatch,
  isLoading = false,
}) => {
  const { base64Images, imagesToBase64, clearImages } = useImageToBase64();

  useEffect(() => {
    if (base64Images) {
      dispatch({ type: "SET_FILES", payload: base64Images });
    }
  }, [base64Images]);

  return (
    <div className={Style.postOverviewWrapper}>
      <MapComponent
        clickMapHandler={onMapClick}
        showDot
        initialMarkers={[state.coordinates]}
      />

      <h1>Edit Post</h1>

      <div className={Style.postContentWrapper}>
        <div className={Style.formGroup}>
          <label>Title</label>
          <input
            autoFocus
            onChange={(e) =>
              dispatch({ type: "SET_TITLE", payload: e.target.value })
            }
            placeholder="Title"
            value={state.title}
            type="text"
          />
        </div>

        <div className={Style.formGroup}>
          <label>Category</label>
          <select
            value={state.tag || ""}
            onChange={(e) =>
              dispatch({
                type: "SET_TAG",
                payload: e.target.value as
                  | "rental"
                  | "job"
                  | "selling"
                  | "meetup"
                  | null,
              })
            }
            className={Style.select}
          >
            <option value="">Select a category</option>
            <option value="rental">Rental</option>
            <option value="job">Job</option>
            <option value="selling">Selling</option>
            <option value="meetup">Meetup</option>
          </select>
        </div>

        <div className={Style.formGroup}>
          <div className={Style.selectedImages}>
            {props.files.length > 0 &&
              props.files.map((link: string, index: number) => (
                <span className={Style.selectedImageWrapper}>
                  <img
                    key={link + "img"}
                    width="160"
                    height="160"
                    src={link || ""}
                  />
                  <button
                    onClick={() => {
                      console.log("click", index, [
                        ...props.files.slice(0, index),
                        ...props.files.slice(index + 1),
                      ]);
                      dispatch({
                        type: "SET_FILES",
                        payload: [
                          props.files.slice(0, index),
                          ...props.files.slice(index + 1),
                        ],
                      });
                    }}
                  >
                    <IoMdClose width={"15px"} height={"15px"} />
                  </button>
                </span>
              ))}
            {base64Images.length > 0 &&
              base64Images.map((image: string, index: number) => (
                <span className={Style.selectedImageWrapper}>
                  <img
                    key={index + "img"}
                    width="160"
                    height="160"
                    src={image || ""}
                  />
                  <button onClick={() => {}}>
                    <IoMdClose width={"15px"} height={"15px"} />
                  </button>
                </span>
              ))}
          </div>
          <label>Select Images</label>
          <div className={Style.fileSelectionWrapper}>
            <input
              onChange={(e) => {
                const file = e?.target?.files;
                imagesToBase64(file);
              }}
              style={{ cursor: "pointer" }}
              type="file"
              multiple
            />
            <button onClick={clearImages}>Clear</button>
          </div>
        </div>

        <div className={Style.formGroup}>
          <label>Location</label>
          <input
            onChange={(e) =>
              dispatch({ type: "SET_LOCATION", payload: e.target.value })
            }
            placeholder="location"
            value={state.location}
            type="text"
          />
        </div>

        <div className={Style.formGroup}>
          <label>Description</label>
          <textarea
            onChange={(e) =>
              dispatch({ type: "SET_DESCRIPTION", payload: e.target.value })
            }
            placeholder="description"
            value={state.description}
            rows={3}
          />
        </div>

        <p className={Style.postOverviewAuthor}>
          By {props?.author?.name || "Unknown author"}
        </p>

        <div className={Style.formGroup}>
          <label>Content</label>
          <textarea
            onChange={(e) =>
              dispatch({ type: "SET_CONTENT", payload: e.target.value })
            }
            placeholder="Content"
            value={state.content}
            rows={8}
          />
        </div>
      </div>

      <div className={Style.editButtons}>
        <button className={Style.secondaryButton} onClick={onCancelClick}>
          Cancel
        </button>

        {userHasValidSession && postBelongsToUser && (
          <button
            className={Style.primaryButton}
            onClick={() => onSaveClick(props.id)}
          >
            {!props.published ? "Save" : "Update"}
          </button>
        )}

        {!props.published && userHasValidSession && postBelongsToUser && (
          <button
            className={Style.publishButton}
            onClick={() => onPublishClick(props.id)}
          >
            Publish
          </button>
        )}

        {userHasValidSession && postBelongsToUser && (
          <button
            className={Style.dangerButton}
            onClick={() => onDeleteClick(props.id)}
          >
            Delete
          </button>
        )}

        {isLoading && <FaSpinner size={"20px"} className={Style.iconSpin} />}
      </div>
    </div>
  );
};

export default PostEdit;
