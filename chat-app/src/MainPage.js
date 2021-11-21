import React from 'react';
import Image from './assets/Image.webp';
import Profile from './Profile';
import {AddContactModal} from './modals';
import apis from './apis';
import { Redirect } from 'react-router';
import { io } from "socket.io-client";

const SelfInfoTile = ({setContacts,user})=>{
    const [dropdown,setDropDown]=React.useState(false);
    const [show,handleShow]=React.useState(false);
    const f=(e)=>{
            if (!document.getElementById('dd').contains(e.target)){
                setDropDown(false);
            }
        }
    const onDrop=()=>{
        window.removeEventListener('click',f)
        window.addEventListener('click',f);
        setDropDown(true);
    };
    const openProfile=()=>{
        console.log("here")
        
        const profile = document.getElementById("profile");
        profile.classList.remove('translator');
    }
    
    console.log(user)
    return(
        <div className="contactListHeader">
                <div className="d-flex align-items-center px-3 ps-2"style={{
                    height:'100%',width:'100%'
                }}>
                    <img src={user?user.image:Image} 
                className="avatar-small  ms-4" alt="profile pic" onClick={openProfile}/>
                    
                    <div className="hidableText ms-4"style={{fontSize: "20px",height:'30px'}}>{user && user.name}</div>
                    
                    <div className="flex-grow-1"></div>
                    <div className="dropdown" style={{position:'relative'}} id="dd">
                        <span className="material-icons" onClick={onDrop}>more_vert</span>
                        {dropdown && <div className="dd-menu">
                            <li className="p-3" onClick={()=>handleShow(true)}>Add Contact</li>
                        </div>}
                    </div>
                    <AddContactModal show={show} handleClose={()=>handleShow(false)}
                    setContacts={setContacts}/>
                </div>
        </div>
    )
}

const ContactInfo = ({contact,switchContacts})=>{
    return(
        <div className="contactListItem"onClick={switchContacts}>
            <div className="d-flex align-items-center px-3"style={{
                height:'100%',width:'100%'
            }}>
                <img src={contact.image===null?Image:contact.image} 
            className="ms-md-1 avatar-small me-1" alt="profile pic" />
                <div className="d-flex flex-column mx-md-2 textArea"
                style={{minWidth:'30%',width:'180px'}}>
                    <div className="hidableText" style={{fontSize: "17px",height:'30px'}}>{contact.name}</div>
                    <div className="hidableText" style={{fontSize: "12px"}}>{contact.about}</div>
                </div>
                <div className="mb-4 ps-4 flex-grow-1 px-3" style={{fontSize: "12px",textAlign:'end'}}>
                    {contact.last_login}
                </div>
            </div>
            
        </div>
    )
}

function ChatBubble({dir,content,name}){
    //const [content,setContent]=React.useState("")
    const myref=React.createRef()
    
    React.useEffect(()=>{
        const setcontent=()=>{
            /*const elems = myref.current;
            console.log(elems)
            if(content){}
            //elems.classList.add('trans');
            setTimeout(()=>setContent(contentItem),300)*/
        };
        setcontent();
    });
    return(
        <div className={`d-flex chat ${dir} my-2 `} style={{width:'100%'}}>
                <div className="chatBubble trans mx-3 p-3 pt-1 c-text-primary" ref={myref}>
                    <div className="d-flex"style={{width:'100%',fontSize:'12px',fontWeight:'300'}}>
                        <div className="">{name}</div>
                        {/*<div className="flex-grow-1" style={{textAlign:'end'}}>3:30PM</div>*/}

                    </div>
                    <div className="pt-1">
                        {content}
                    </div>
                    <div className="d-flex" style={{width:'100%'}}>
                    <div className="flex-grow-1"></div>
                    {/*<span className="material-icons md-18">
                    done
    </span>*/}
                    </div>
                </div>
        </div>
    );
}
//const str="Lorem Ipsum is simply dummy text of theeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s," 

let socket;
class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            messages:[],
            value:'',
            switcher:true,
            redirect:false,
            contacts:[],
            clickedContact:{}
        }
        this.ref=React.createRef();
    }  
    
    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          const btn = document.getElementById('sendBtn');
          btn.click();
        }
      }

      switchContacts = async(i)=>{
          let data  = await apis.viewChats(this.state.contacts[i].room)
          this.setState({switcher:false,clickedContact:this.state.contacts[i],messages:data.data.data})
          socket.emit('begin_chat',this.state.contacts[i].room,this.state.token)
      }

      componentDidMount = async()=>{
        try {
            let data = await apis.verifyLogin();            
            console.log(!data.data.data.success && !this.state.redirect)
            if(!data.data.data.success && !this.state.redirect)this.setState({redirect:true})
            else{
                data = data.data
                this.setState({user_id:data.data.user_id,user:data.data,token:data.data.token})
                data = await apis.viewContact();
                this.setState({contacts:data.data.data})
                console.log(data)
        }
        } catch (error) {
            console.log(error)
        }

        
        socket = io("localhost:8000/chat")
        
        socket.on('response',(data)=>{
            data=JSON.parse(data);
            if(data.id!==this.state.user_id){//check if message from other user
                let messages=this.state.messages.slice();
                messages=messages.concat([{type:1,string:data.message}]);
                //console.log(messages)
                this.setState({messages:messages})
            }
        })
        socket.on('error',(data)=>console.log(data))
    }

    componentDidUpdate=()=>{
        if(this.state.clicked){
            const element=document.getElementsByClassName("chat");
            //element.scrollIntoView()
            if(element.length>0)element[element.length-1].scrollIntoView();
            this.setState({clicked:false})
        }
    }

    setContacts=async()=>{
        let data = await apis.viewContact();
        this.setState({contacts:data.data.data})
    }

    message=(e)=>{
        //senf message to socketio server
        const value=this.state.value.trim();
        if(value !=='' &&  value!==' '){
            let messages=this.state.messages.slice();
            messages=messages.concat([{type:0,string:this.state.value,'name':'You'}]);
            //console.log(messages)
            this.setState({messages:messages,clicked:true})
            //console.log({name:this.state.user_id,message:value,room:'room'})
            socket.emit('message',{id:this.state.clickedContact.room,message:value,
            token:this.state.token})
            //scroll to bottom
            
        }
    }
    
    handleUpdate=async(name,about)=>{
        await apis.editProfile(this.state.user_id,name,about);
        let data = await apis.verifyLogin();
        this.setState({user:data.data.data})
    }

    handleImage=async()=>{
        await apis.editImage(this.state.user_id,new FormData(document.getElementById("fileForm")));
        let data = await apis.verifyLogin();
        this.setState({user:data.data.data})
    }

    render(){
        const {value,switcher,redirect,contacts,clickedContact,user}=this.state;
        if (redirect)return <Redirect to='/'/>
        return(
            <div className="d-flex" style={{height:'100vh',maxHeight:'100vh',width:'100%'}}>
                <Profile user={user} handleUpdate={this.handleUpdate} handleImage={this.handleImage}/>
                
                <div className={`contactList c-bg-primary ${ switcher?"":"d-none d-md-block"}`}
                style={{height:'100vh',maxHeight:'100vh',overflow:'auto'}}>
                    
                    <SelfInfoTile setContacts={this.setContacts} user={user}/>
                    {contacts.map((contact,index)=>
                        <ContactInfo contact={contact} switchContacts={()=>this.switchContacts(index)} key={index}/>
                    )}
                </div>
           <div className={switcher?"d-none d-md-block":""} style={{width:'100%'}} >
                <div className={`chatSection d-flex flex-column-reverse  c-bg-secondary`} style={{height:'100vh',
                    position:'relative'}}id="chat">
                    
                    {Object.keys(clickedContact).length>0 && <div className="contactListHeader"  style={{position:'absolute',top:0,width:'100%',backgroundColor:
                'var(--btn-secondary)',zIndex:23}}>
                        <div className="d-flex align-items-center px-3"style={{
                            height:'100%',width:'100%'
                        }}>
                            <span className="material-icons-outlined d-md-none" unselectable="on" onClick={()=>this.setState({switcher:true})} 
                            style={{'cursor':'pointer'}}>
                            arrow_back
                    </span>
                            <img src={user?user.image:Image} width='50px' height='50px' 
                        className="avatar-small  ms-4" alt="profile pic"/>
                            <div className="hidableText ms-4"style={{fontSize: "20px",height:'30px'}}>{clickedContact.name}</div>
                        </div>
                    </div>}

                    <div className="search" style={{position:'relative'}}>
                            <div className="" style={{width:'100%',maxHeight:'85vh',overflowY:'auto'}}>
                                <div className="py-3"></div>
                                    {this.state.messages.map((message,key)=>
                                        <ChatBubble key={key} dir={message.type===0?'left':'right'} content={message.string}
                                        init={key===0} name={message.type===0?"You":message.name}/>
                                    )}
                                
                            </div>
                        {Object.keys(clickedContact).length>0 && <div className="px-2 pb-2">
                            <input type="text" name="" id="" className="form-control " style={{borderRadius:10}}
                            value={value} onChange={(e)=>this.setState({value:e.target.value})} onKeyDown={this._handleKeyDown}/>
                            
                            <span className="material-icons-outlined"style={{position:'absolute',bottom:15,right:15,
                            color:'var(--btn-primary)',cursor:'pointer'}}onClick={this.message} id='sendBtn'>
                            send
                            </span>
                        </div>}
                    
                    
                    </div>
                    
                </div>
            </div>
            </div>
            )
    }
}

export default MainPage;