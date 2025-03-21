import React, {useState, useEffect} from "react"
import { GetServerSidePropsContext } from "next"
import ReactMarkdown from "react-markdown";
import Router from "next/router";
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import Layout from "../../components/Layout"
import prisma from "../../../lib/prisma";
import Style from "../../styles/Post.module.scss";
import Image from "next/image";
import { isValidURL } from "../../utility/util"
import  MapComponent  from '@/components/MapComponent/MapComponent';
import { NominatimReverseResponse } from "../../utility/util";
import placeholder from "../../assets/placeholderImage.png";
import MessageSmall from "../../components/MessageSmall"

// The route is dynamic here so use GetServerSideProps as this is done on runtime

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
  const router = useRouter()

  const [title, setTitle] = useState<string>(props?.title || '')
  const [coverImg, setCoverImg] = useState<string>(props?.coverImg || '')
  const [description, setDescription] = useState<string>(props?.description || '')
  const [location, setLocation] = useState<string>(props?.location || '')
  const [coordinates, setCoordinates] = useState<number[]>([])
  const [content, setContent] = useState<string>(props.content || '')
  const [showEdit, setShowEdit] = useState<boolean>(false)


  const [messageTitle, setMessageTitle] = useState<string>('');
  const [messageBody, setMessageBody] = useState<string>('')
  const [showMessage, setShowMessage] = useState<boolean>(false)

  const[messageSent , setMessageSent] = useState<boolean>(false)

  async function publishPost(id: string): Promise<void> {
    await fetch(`/api/publish/${id}`, {
      method: 'PUT',
    });
    await Router.push('/');
  }
  
  async function deletePost(id: string): Promise<void> {
    await fetch(`/api/post/${id}`, {
      method: 'DELETE',
    });
    Router.push('/');
  }
  
  const editPost = async (id: string) => {
    try {
      const body = { title, content, coverImg : coverImg, description, location, coordinate : coordinates };
      await fetch(`/api/post/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      // await Router.push('/drafts');
      router.refresh()
    } catch (error) {
      console.error(error);
    }
  };

  const submitData = async( message : string) =>{
    try {
        const body = { title , content :message, messageReceipient : props.author.email, context : props.id };
        await fetch('/api/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        setMessageSent(true)
        await setTimeout(()=>{
          setShowMessage(false)
        }, 1000)
      } catch (error) {
        console.error(error);
      }
  }

  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }

  const handleMapClick = async (click : Promise<NominatimReverseResponse>, coords : number[] | undefined)=>{
    const addressClicked = await click
    setLocation( addressClicked.display_name)
    coords && setCoordinates(coords)
  }

  const postBelongsToUser = session?.user?.email === props.author?.email;
  const userHasValidSession = Boolean(session);
  console.log(props.coordinate, props)
  return (
    <Layout>
      <>
      {!showEdit && 
      <div className={Style.postOverviewPublic}>
        <div className={Style.postOverviewHeaderWrapper}>
          <h1>{title}</h1>
          {postBelongsToUser && userHasValidSession && 
          <div className={Style.buttonGroup}>
            <button onClick={()=> setShowEdit(prev => !prev)}>{showEdit ? 'Show Preview' : 'Edit Post'}</button>
            {!props.published  && <button onClick={()=>publishPost(props.id)}>Publish</button>}
          </div>
        }
        </div>
        <Image src={isValidURL(props?.coverImg)? props?.coverImg : placeholder} alt={""} width={1000} height={500}/>
        <p>{props?.author.name}</p>
        <p>{props?.description}</p>
        {props?.content && <ReactMarkdown>{props.content}</ReactMarkdown>}
        <div className={Style.section}>
          <h2>{`Location`}</h2>
          <p>{`${props.location}`}</p>
          {props?.coordinate.length > 0 && <MapComponent initialMarkers={props?.coordinate ? [props?.coordinate] : undefined} zoom={16} center />}
        </div>
      </div>}
      {showEdit && 
        <div className={Style.postOverviewWrapper}>
          <MapComponent clickMapHandler={handleMapClick} showDot initialMarkers={[props.coordinate]} />
          <h1>Edit Post</h1>
          <div className={Style.postContentWrapper}>
          Title
          <input
              autoFocus
              onChange={(e)=>{setTitle(e.target.value)}}
              placeholder="Title"
              value={title}
              type="text"
            />
            Cover Image
            <input
              autoFocus
              onChange={(e)=>{setCoverImg(e.target.value)}}
              placeholder="Image Url"
              value={coverImg}
              type="text"
            />
            Location
            <input
              autoFocus
              onChange={(e)=>{setLocation(e.target.value)}}
              placeholder="location"
              value={location}
              type="text"
            />
            Description
            <textarea
              autoFocus
              onChange={(e)=>{setDescription(e.target.value)}}
              placeholder="description"
              value={description}
              rows={3}
              cols={50}
            />
          <p className={Style.postOverviewAuthor}>By {props?.author?.name || "Unknown author"}</p>
          <textarea
              cols={50}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              value={content}
              rows={8}
            />
            </div>
        <div>
            {!props.published && userHasValidSession && postBelongsToUser && (
                <button className={Style.publishDraft} onClick={() => publishPost(props.id)}>Publish</button>
            )}
            {userHasValidSession && postBelongsToUser && (
              <button className={Style.deletePost} onClick={() => editPost(props.id)}>{!props.published ? "Save" : "Edit"}</button>
            )}
            {userHasValidSession && postBelongsToUser && (
              <button className={Style.deletePost} onClick={() => deletePost(props.id)}>Delete</button>
            )}
          </div>
        </div>
      }
      {!postBelongsToUser && (
        <div className={Style.buttonGroup}>
          <button onClick={()=> setShowMessage(prev => !prev)}>{!showMessage ? "Send Message" : "Hide Message"}</button>
        </div>
      )}
      {showMessage && (
        <>
        <MessageSmall recepient={props?.author.name} showSuccess={messageSent} onClick={(message)=>{
            !messageSent && submitData(message)
        }} />
        </>
      )}
      </>

    </Layout>
  )
}

export default Post