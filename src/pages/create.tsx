import React, {  useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Router from 'next/router';
import Style from "../styles/Post.module.scss";

//test
import { useSelector, useDispatch } from 'react-redux';
import { resetData, setData } from '@/store/postState';
import { NominatimReverseResponse } from '@/utility/util';
import { RootState } from '../store/index';
import MapComponent from '@/components/MapComponent/MapComponent';
import useImageToBase64 from "@/hooks/useImageToBase64";

const Draft = ():JSX.Element => {
  //rtk hooks
  const data = useSelector((state: RootState) => state.post.data)
  const dispatch = useDispatch();

  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [files, setFiles] = useState<string[]>([])
  const [description, setDescription] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [coordinate, setCoordinate] = useState<number[]>([])

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content, files, description, location, coordinate};
      await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/drafts');
    } catch (error) {
      console.error(error);
    }
  };

  const handleMapClick = async (click : Promise<NominatimReverseResponse>, coords : number[] | undefined)=>{
    const addressClicked = await click
    setLocation( addressClicked.display_name)
    coords && setCoordinate(coords)
  }


  const {base64Images, imagesToBase64, clearImages} = useImageToBase64()

  useEffect(()=>{
    if(base64Images){
      setFiles(base64Images)
    }

  }, [base64Images])

  return (
    <Layout>
      <div className={Style.postOverviewWrapper}>
        <MapComponent 
          clickMapHandler={handleMapClick} 
          showDot
        />
        <h1>New Draft</h1>
        <form onSubmit={submitData}>
          <input
            autoFocus
            onChange={(e)=>{setTitle(e.target.value)}}
            placeholder="Title"
            type="text"
          />
        <div className={Style.formGroup}>
            <div className={Style.selectedImages}>
                {base64Images.length > 0 && base64Images.map((image : string, index : number)=> <img key={index+'img'} width="160" height="160" src={image || ''}/>)}
            </div>
          <label>Select Images</label>
          <div className={Style.fileSelectionWrapper}>
            <input
                onChange={(e) => {
                    const file = e?.target?.files;
                    imagesToBase64(file)
                }}
                style={{cursor : "pointer"}}
                type="file"
                multiple
            />
            <button onClick={clearImages}>Clear</button>
        </div>
        </div>
          Description
          <textarea
            cols={50}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={3}
          />
          Location 
            <input // Potentially need refactor to only allow lat long, or verfied address, also having our own database
              onChange={(e)=>{setLocation(e.target.value)}}
              placeholder="Location"
              type="text"
              value={location}
            />
          Content
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
          />
          <button disabled={!content || !title} type="submit" >Create</button>
          <a className={Style.back} href="#" onClick={() => Router.push('/')}>
            Cancel
          </a>
          {/* <a className={Style.back} href="#" onClick={() => dispatch(setData("aaa"))}>
            Mock Set Fake
          </a> */}
          {/* <a className={Style.back} href="#" onClick={() => dispatch(resetData())}>
            Reset
          </a> */}
        </form>
      </div>
    </Layout>
  )
};

export default Draft;