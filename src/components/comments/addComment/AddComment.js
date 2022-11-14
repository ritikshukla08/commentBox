import React, { useRef, useState } from "react";
import classes from "./AddComment.module.css";
import { db } from "../../../firebase-config";
import { collection, addDoc, doc } from "firebase/firestore";

const AddComment = (props) => {
  const [myComment, setMyComment] = useState("");
  const commentCollections = collection(db, "ritik");

  const commentValue = (e) => {
    setMyComment(e.target.value);
  };

  const inputRef = useRef(null);

  if (props.tag) {
    inputRef.current.focus();
  }

  let timestamp = new Date().getUTCMilliseconds();

  const addData = async (e) => {
    e.preventDefault();
    await addDoc(commentCollections, {
      comments: myComment,
      reply_id: props.tag ? props.userId : null,
      id: timestamp,
    });

    props.get(timestamp);
    setMyComment("");
    props.closeReply();

    props.fetch();
  };

  return (
    <div className={classes.addCommentSection}>
      <form className={classes.commentForm}>
        {props.tag && (
          <div className={classes.userTag}>
            <span>{`@${props.name}`}</span>
            <span onClick={props.closeReply} className={classes.close}>
              X
            </span>
          </div>
        )}
        <input
          type="text"
          value={myComment}
          placeholder="Add a comment..."
          onChange={commentValue}
          ref={inputRef}
        />
        <button className={classes.postBtn} onClick={addData}>
          post
        </button>
      </form>
    </div>
  );
};

export default AddComment;
