import React, { useRef, useState } from 'react';
import Layout from '@/components/Layout';
import Router from 'next/router';
import Style from "../styles/Create.module.scss"

//test
import { useSelector, useDispatch } from 'react-redux';
import { resetData, setData } from '@/store/postState';
import { NominatimReverseResponse } from '@/utility/util';
import { RootState } from '../store/index';
import MapComponent from '@/components/MapComponent/MapComponent';

const Draft = ():JSX.Element => {
  //rtk hooks
  const data = useSelector((state: RootState) => state.post.data)
  const dispatch = useDispatch();

  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [coverImg, setCoverImg] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [coordinate, setCoordinate] = useState<number[]>([])

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content, coverImg, description, location, coordinate};
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
    console.log(addressClicked)
    setLocation( addressClicked.display_name)
    coords && setCoordinate(coords)
  }

  return (
    <Layout>
      <div className={Style.page}>
        <MapComponent clickMapHandler={handleMapClick} showDot/>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input
            autoFocus
            onChange={(e)=>{setTitle(e.target.value)}}
            placeholder="Title"
            type="text"
          />
          Cover Image URL
          <input
            onChange={(e)=>{setCoverImg(e.target.value)}}
            placeholder="Cover Image"
            type="text"
          />
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