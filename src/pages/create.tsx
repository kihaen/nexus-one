import React, { useRef } from 'react';
import Layout from '@/components/Layout';
import Router from 'next/router';
import Style from "../styles/Create.module.scss"

const Draft = ():JSX.Element => {

  const title = useRef<HTMLInputElement>(null!)
  const content = useRef<HTMLTextAreaElement>(null!)

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title : title.current.value, content : content.current.value };
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
            ref={title}
            onChange={(e)=>{title.current.value = e.target.value}}
            placeholder="Title"
            type="text"
          />
          <textarea
            cols={50}
            ref = {content}
            onChange={(e) => content.current.value = e.target.value}
            placeholder="Content"
            rows={8}
          />
          <input disabled={!content || !title} type="submit" value="Create" />
          <a className={Style.back} href="#" onClick={() => Router.push('/')}>
            Cancel
          </a>
        </form>
      </div>
    </Layout>
  )
};

export default Draft;