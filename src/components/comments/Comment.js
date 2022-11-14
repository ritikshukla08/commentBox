import React, { useEffect, useState } from "react";
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
  const [addedData, setAddedData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const commentsCollectionRef = collection(db, "ritik");

  const fetchData = async () => {
    setIsLoading(true);
    const response = await getDocs(commentsCollectionRef);
    console.log(response);
    setData(response.docs.map((doc) => ({ ...doc.data(), Cid: doc.id })));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDataAdded = (data) => {
    setAddedData(data);
  };

  if (isLoading) {
    return <h2 className={classes.loading}>Loading...</h2>;
  }

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

  console.log("data state", data);

  const cmtReplies = data?.map((cmt) => {
    let temp = [];
    let filterReplies = data?.filter((val) => val.reply_id === cmt.id);
    cmt.replies = filterReplies;

    temp = { ...cmt };

    return temp;
  });

  const finalData = cmtReplies.filter((fil) => fil.reply_id === null);

  let temp = [];
  const replies = (rplyArr, index, clear = false) => {
    if (clear) temp = [];

    rplyArr.map((rply) => {
      temp.push(rply);

      if (rply.replies.length > 0) {
        replies(rply.replies, rply.id);
      }
    });

    return temp;
  };

  return (
    <div className={classes.commentSection}>
      <div className={classes.heading}>
        <h3>comments</h3>
      </div>
      <div className={classes.commentsMain}>
        {finalData?.map((cmt) => (
          <div key={cmt.id}>
            {cmt.reply_id === null && (
              <div className={classes.userAndComment}>
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
            {replies(cmt.replies, cmt.id, true).map((data) => {
              return (
                <CommentBox
                  key={data.id}
                  data={data}
                  click={() => {
                    replyHandler(data.id);
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <AddComment
        name={user}
        get={getDataAdded}
        userId={id}
        closeReply={clearReply}
        tag={replyTag}
        fetch={fetchData}
      />
    </div>
  );
};

export default Comment;

function CommentBox({ data, click }) {
  return (
    <div style={{ marginLeft: "50px" }} className={classes.userAndComment}>
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
