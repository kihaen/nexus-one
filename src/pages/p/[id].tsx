import React, { useEffect, useReducer} from "react"
import { GetServerSidePropsContext } from "next"
import Router from "next/router";
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import Layout from "../../components/Layout"
import prisma from "../../../lib/prisma";
import MessageSmall from "../../components/MessageSmall"
import PostView from "../../views/PostView";
import PostEdit from "../../views/PostEdit";
import { NominatimReverseResponse } from "@/utility/util";

// Keep your existing types and reducer
export type PostState = {
  title: string;
  coverImg: string;
  coverIdx : number;
  files : string[];
  description: string;
  location: string;
  coordinates: number[];
  content: string;
  showEdit: boolean;
  messageTitle: string;
  messageBody: string;
  showMessage: boolean;
  messageSent: boolean;
}

export type PostAction = 
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_COVER_IMG'; payload: string }
  | { type: 'SET_FILES', payload : string[] }
  | { type: 'SET_DESCRIPTION'; payload: string }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'SET_COORDINATES'; payload: number[] }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'TOGGLE_EDIT' }
  | { type: 'SET_MESSAGE_TITLE'; payload: string }
  | { type: 'SET_MESSAGE_BODY'; payload: string }
  | { type: 'TOGGLE_MESSAGE' }
  | { type: 'SET_MESSAGE_SENT'; payload: boolean }
  | { type: 'RESET_STATE'; payload: Partial<PostState> }
  | { type: 'CHANGE_IMAGE'; payload: number };
  

const initialState: PostState = {
  title: '',
  coverImg: '',
  coverIdx : 0,
  files : [],
  description: '',
  location: '',
  coordinates: [],
  content: '',
  showEdit: false,
  messageTitle: '',
  messageBody: '',
  showMessage: false,
  messageSent: false
};

function reducer(state: PostState, action: PostAction): PostState {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_COVER_IMG':
      return { ...state, coverImg: action.payload };
    case 'SET_FILES':
      return { ...state, files: action.payload };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_COORDINATES':
      return { ...state, coordinates: action.payload };
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'TOGGLE_EDIT':
      return { ...state, showEdit: !state.showEdit };
    case 'SET_MESSAGE_TITLE':
      return { ...state, messageTitle: action.payload };
    case 'SET_MESSAGE_BODY':
      return { ...state, messageBody: action.payload };
    case 'TOGGLE_MESSAGE':
      return { ...state, showMessage: !state.showMessage };
    case 'SET_MESSAGE_SENT':
      return { ...state, messageSent: action.payload };
    case 'CHANGE_IMAGE':
      return { ...state, files: [state.files[action.payload], ...state.files.slice(0, action.payload), ...state.files.slice(action.payload + 1)] };
    case 'RESET_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const getServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const post = await prisma?.post.findUnique({
        where : {
            id : String(params?.id)
        },
        include: {
            author: {
                select: { name: true, email : true },
              },
        }
    });
    return { props : post }
}

const Post = (props : any) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => {
    dispatch({ 
      type: 'RESET_STATE', 
      payload: {
        title: props?.title || '',
        files: props?.files || [],
        coverImg: props?.coverImg,
        description: props?.description || '',
        location: props?.location || '',
        coordinates: props?.coordinate || [],
        content: props?.content || '',
      }
    });
  }, [props]);


  const publishPost = async (id: string): Promise<void> => {
    try{
      const body = { 
        title: state.title, 
        content: state.content, 
        coverImg: state.coverImg, 
        files : state.files,
        description: state.description, 
        location: state.location, 
        coordinate: state.coordinates 
      };
      await fetch(`/api/publish/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }
    catch(e){
      console.error(e);
    }
    await Router.push('/');
  };
  
  const deletePost = async (id: string): Promise<void> => {
    await fetch(`/api/post/${id}`, {
      method: 'DELETE',
    });
    Router.push('/');
  };
  
  const editPost = async (id: string) => {
    try {
      const body = { 
        title: state.title, 
        content: state.content, 
        coverImg: state.coverImg, 
        files : state.files,
        description: state.description, 
        location: state.location, 
        coordinate: state.coordinates 
      };
      await fetch(`/api/post/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }; 

  const submitData = async(message: string) => {
    try {
      const body = { 
        title: state.title, 
        content: message, 
        messageReceipient: props.author.email, 
        context: props.id 
      };
      await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      dispatch({ type: 'SET_MESSAGE_SENT', payload: true });
      setTimeout(() => {
        dispatch({ type: 'TOGGLE_MESSAGE' });
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMapClick = async (click: Promise<NominatimReverseResponse>, coords: number[] | undefined) => {
    const addressClicked = await click;
    dispatch({ type: 'SET_LOCATION', payload: addressClicked.display_name });
    if (coords) {
      dispatch({ type: 'SET_COORDINATES', payload: coords });
    }
  };

  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }

  const postBelongsToUser = session?.user?.email === props.author?.email;
  const userHasValidSession = Boolean(session);

  return (
    <Layout>
      {!state.showEdit ? (
        <PostView
          state={state}
          props={props}
          postBelongsToUser={postBelongsToUser}
          userHasValidSession={userHasValidSession}
          onEditClick={() => dispatch({ type: 'TOGGLE_EDIT' })}
          onPublishClick={publishPost}
          onMessageClick={() => dispatch({ type: 'TOGGLE_MESSAGE' })}
          dispatch={dispatch}
        />
      ) : (
        <PostEdit
          state={state}
          props={props}
          userHasValidSession={userHasValidSession}
          postBelongsToUser={postBelongsToUser}
          onSaveClick={editPost}
          onDeleteClick={deletePost}
          onCancelClick={() => dispatch({ type: 'TOGGLE_EDIT' })}
          onPublishClick={publishPost}
          onMapClick={handleMapClick}
          dispatch={dispatch}
        />
      )}
      
      {state.showMessage && (
        <MessageSmall 
          recepient={props?.author.name} 
          showSuccess={state.messageSent} 
          onClick={(message) => {
            !state.messageSent && submitData(message);
          }} 
        />
      )}
    </Layout>
  );
};

export default Post;