
import moment from 'moment';
import React from 'react'
import Image from '../assets/Image.webp';

const ChatBubble=({chats,repeat })=>{
    return (
        <div className="d-flex px-3 chat-bubble">
            <div className="mt-2 mx-2" style={{minWidth:'40px'}}>
                {!repeat &&<img src={chats.profile_pic?chats.profile_pic:Image} alt="" className="avatar-medium " />}
            </div>
            
            <div className="">
                {!repeat&&<div className="fw-bold mt-1">{chats.name}</div>}
                <div className="my-1">{chats.string}</div>
            </div>
        </div>
            
         
    )
}
const Chat=({messages=[]})=>{
    let groupBy = (data) =>{
        return data.reduce(function(acc, item) {
          (acc[new Date(item["posted_on"]).setHours(0,0,0,0)] = acc[new Date(item["posted_on"]).setHours(0,0,0,0)] || []).push(item);
          return acc;
        }, {});
      };
    let f = (chats)=>{

        let l=[]
        for(let i=0;i<chats.length;i++){
            let repeat=false;
            if(i!==0){
                if(chats[i-1].user_id===chats[i].user_id)repeat=true;
            }
            l.push(<div className="">
                <ChatBubble chats={chats[i]}repeat={repeat}/>
            </div>)
        }
        //console.log(l)
        return l;
    }
    messages=groupBy(messages)
    //transform messages
    //console.log(messages)
    //console.log(Object.keys(messages).map(message =>new Date(parseInt(message))))
    return (
        <div>
            {Object.keys(messages).map((message,key) =>
                <div className="" key={key}>
                    <div className="d-flex align-items-center">
                        <div className="divider"></div>
                        <div className="date">{moment(new Date(parseInt(message))).format('dddd, Do MMMM')}</div>
                        <div className="divider"></div>
                        
                    </div>
                    {f(messages[message])}
                </div>
                )}
        </div>
        
    );
}

export default Chat;