import React, { useRef, useState } from 'react';
import Layout from '@/components/Layout';
import Router from 'next/router';
import Style from "../styles/Create.module.scss"

//test
import { useSelector, useDispatch } from 'react-redux';
import { resetData, setData } from '@/store/postState';
import { RootState } from '../store/index';

const Draft = ():JSX.Element => {
  //rtk hooks
  const data = useSelector((state: RootState) => state.post.data)
  const dispatch = useDispatch();

  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
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

  return (
    <Layout>
      <div className={Style.page}>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input
            autoFocus
            onChange={(e)=>{setTitle(e.target.value)}}
            placeholder="Title"
            type="text"
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
          />
          <input disabled={!content || !title} type="submit" value="Create" />
          <a className={Style.back} href="#" onClick={() => Router.push('/')}>
            Cancel
          </a>
          <a className={Style.back} href="#" onClick={() => dispatch(setData("aaa"))}>
            Mock Set Fake
          </a>
          <a className={Style.back} href="#" onClick={() => dispatch(resetData())}>
            Reset
          </a>
        </form>
      </div>
    </Layout>
  )
};

export default Draft;