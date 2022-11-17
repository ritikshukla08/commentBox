import React, { useEffect, useLayoutEffect, useState } from "react";
import classes from "./Comment.module.css";
import userDefault from "../../Image/user.png";
import AddComment from "./addComment/AddComment";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

const Comment = () => {
  const [data, setData] = useState([]);
  const [replyTag, setReplyTag] = useState(false);
  const [user, setUser] = useState("");
  const [id, setId] = useState("");
  const [cmtId, setCmtId] = useState("");
  const commentsCollectionRef = collection(db, "ritik");

  const getTheId = (id) => {
    setCmtId(id);
  };

  const setCmtHandler = (cmt) => {
    console.log("cmt", cmt);
    setData((oldData) => [...oldData, cmt]);
  };

  const scroll = (id) => {
    console.log("call scroll ", id);
    document.querySelector(`#${id}`).scrollIntoView({ behavior: "smooth" });
    console.log(id);
  };

  const fetchData = async () => {
    const response = await getDocs(commentsCollectionRef);
    setData(response.docs.map((doc) => ({ ...doc.data(), Cid: doc.id })));
    console.log(cmtId);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (cmtId) scroll(cmtId);
  }, [data]);

  const replyHandler = (idNo) => {
    setUser(`user${idNo}`);
    setId(idNo);
    setReplyTag(true);
  };

  const clearReply = (e) => {
    e?.preventDefault();
    setUser("");
    setId("");
    setReplyTag(false);
  };

  const cmtReplies = data?.map((cmt) => {
    let temp = [];
    let filterReplies = data?.filter((val) => val.reply_id === cmt.id);
    cmt.replies = filterReplies;
    cmt.count = 1;

    temp = { ...cmt };

    return temp;
  });

  const finalData = cmtReplies.filter((fil) => fil.reply_id === null);

  let temp = [];

  const replies = (rplyArr, index, clear = false) => {
    if (clear) temp = [];

    rplyArr.map((rply) => {
      rply.count = index;
      temp.push(rply);

      if (rply.replies.length > 0) {
        replies(rply.replies, rply.count + 1);
      }
    });

    return temp;
  };

  return (
    <div className={classes.commentSection} id="realid">
      <div className={classes.heading}>
        <h3>comments</h3>
      </div>
      <div className={classes.commentsMain}>
        {finalData?.map((cmt) => (
          <div key={cmt.id}>
            {cmt.reply_id === null && (
              <div className={classes.userAndComment} id={cmt.id}>
                <div>
                  <img src={userDefault} className={classes.userImg} />
                </div>
                <div className={classes.rightSide}>
                  <div>
                    <span>{`user${cmt.id}`}</span>
                    <p>{cmt.comments}</p>
                  </div>
                  <div className={classes.reply}>
                    <a
                      onClick={() => {
                        replyHandler(cmt.id);
                      }}
                    >
                      reply
                    </a>
                  </div>
                </div>
              </div>
            )}
            {cmt.replies &&
              replies(cmt.replies, cmt.count, true).map((data) => {
                return (
                  <CommentBox
                    key={data.id}
                    data={data}
                    click={() => {
                      replyHandler(data.id);
                    }}
                    count={data.count}
                  />
                );
              })}
          </div>
        ))}
      </div>
      <AddComment
        name={user}
        userId={id}
        closeReply={clearReply}
        tag={replyTag}
        fetch={fetchData}
        get={getTheId}
        setCmt={setCmtHandler}
      />
    </div>
  );
};

export default Comment;

function CommentBox({ data, click, count }) {
  return (
    <div
      style={{ marginLeft: `${50 * count}px` }}
      className={classes.userAndComment}
      id={data.id}
    >
      <div>
        <img src={userDefault} className={classes.userImg} />
      </div>
      <div className={classes.rightSide}>
        <div>
          <span>{`user${data.id}`}</span>
          <p>
            <a className={classes.replyUserName}>{`@user${data.reply_id}  `}</a>
            {data.comments}
          </p>
        </div>
        <div className={classes.reply}>
          <a onClick={click}>reply</a>
        </div>
      </div>
    </div>
  );
}
