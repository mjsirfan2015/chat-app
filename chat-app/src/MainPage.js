import React from 'react';
import Profile from './Profile';
import {AddContactModal, ChangeThemeModal} from './modals';
import apis from './apis';
import { Redirect } from 'react-router';
import { io } from "socket.io-client";
import {  ContactInfo, ExpandableContainer } from './contacts/contacts';
import Chat from './chats/chats';

const NavBar = function(){
    const [side, setSide] = React.useState(true)
    
    document.addEventListener('click',(e)=>{
        const element1 = document.getElementById('content');
        //console.log(element)(element.contains(e.target))
        if((element1.contains(e.target))){
            //console.log(!side,!element1.contains(e.target),!element2.contains(e.target))
            document.getElementById('list').classList.add('translator')
            setSide(true);
        }
    });

    
    const showSide=()=>{
        if (!side){
            document.getElementById('list').classList.add('translator')
            setSide(true);
        }else{
            document.getElementById('list').classList.remove('translator')
            setSide(false);
        }
    }
    return (
        <div className="navbar" id="mainNav">
            <div className="d-flex align-items-center ">
                <button className="btn-ico-2 d-md-none me-2" style={{height:'4vh'}}onClick={showSide}>
                <span class="material-icons">
                menu
                </span>
                </button>
                <div className="fs-5 c-text-primary d-flex align-items-center" style={{height:'4vh'}}>Chat-App</div>
            </div>
        </div>
    )
}

//const str="Lorem Ipsum is simply dummy text of theeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s," 

const AddButton=({text,onClick=null})=>{
    return(
        <button className="btn-ico-2 ps-4"style={{width:'100%'}} onClick={onClick}>       
            <span className="material-icons">
            add
            </span>
            <div className="hidableText fs-6 c-text-primary pt-1"
            style={{textAlign:'left'}}>{text}</div>
        </button>
    );
}

const EmptyScreen=({showAddContact,hide})=>{
    if(!hide)return(
        <div className="d-flex flex-column justify-content-center align-items-center empty-screen"
        style={{height:'100vh'}}>
            <span class="material-icons"style={{fontSize:128}}>
                people_alt
            </span>
            <button className="btn c-btn-primary c-text-primary d-flex align-items-center"
            onClick={showAddContact}>
                <span class="material-icons">
                    add
                </span>
                
                Add Contacts
            </button>
            {/*<button className="btn c-btn-primary c-text-primary d-flex align-items-center mt-2">
                <span class="material-icons">
                    add
                </span>
                
                Add Rooms
    </button>*/}
        </div>        
    )
    else return null;
}

const SideBar = ({children})=>{
    return(
        <>
            <div className="c-bg-primary contactList d-none d-md-block"style={{height:'100vh',maxHeight:'100vh',overflow:'auto',paddingTop:'5vh'}}>
            {children}
            </div>
            <div id="list" className="sidebar c-bg-primary contactList d-md-none translator"style={{height:'100vh',maxHeight:'100vh',overflow:'auto',paddingTop:'5vh'}}>
            {children}
            </div>
        </>
    )
}

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
            clickedContact:{},
            showAddContact:false,
            page:null,
            showProfile:false,
            showTheme:false,
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
            if(!data.data.data.success && !this.state.redirect)this.setState({redirect:true})
            else{
                data = data.data
                this.setState({user_id:data.data.user_id,user:data.data,token:data.data.token})
                data = await apis.viewContact();
                this.setState({contacts:data.data.data})
        }
        } catch (error) {
            console.log(error)
        }

        
        socket = io("localhost:8000/chat")
        
        socket.on('response',(data)=>{
            data=JSON.parse(data);
            if(data.id!==this.state.user_id){//check if message from other user
                let messages=this.state.messages.slice();
                messages=messages.concat([{type:1,string:data.message,posted_on:data.posted_on,name:data.name,user_id:data.user_id,
                profile_pic:data.profile_pic}]);
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
            messages=messages.concat([{type:0,string:this.state.value,'name':this.state.user.name,user_id:this.state.user.user,posted_on:new Date(Date.now()),profile_pic:this.state.user.image}],
            );
            this.setState({messages:messages,clicked:true,value:''})
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
        console.log("hi")
        await apis.editImage(this.state.user_id,new FormData(document.getElementById("fileForm")));
        let data = await apis.verifyLogin();
        this.setState({user:data.data.data})
    }

    render(){
        const {value,redirect,contacts,clickedContact,user,showAddContact,
            showProfile,showTheme}=this.state;
        const {theme,setTheme}=this.props;
        if (redirect)return <Redirect to='/'/>
        return(
        
        <div style={{height:'100vh',maxHeight:'100vh',width:'100%'}}>
            <ChangeThemeModal theme={theme} setTheme={setTheme} show={showTheme}
            handleClose={()=>this.setState({showTheme:false})}/>
            <NavBar/>
            <Profile show={showProfile} handleClose={()=>this.setState({showProfile:false})}
            handleImage={this.handleImage} user={user} theme={theme}/>
            <AddContactModal show={showAddContact} theme={theme}
            handleClose={()=>this.setState({showAddContact:false})}/>
            
            <div className="d-flex" style={{width:'100%'}}>
                
                <SideBar>
                    <div className=""
                    >
                        <ExpandableContainer text="Contacts">
                            <>
                                {contacts.map((contact,index)=>
                                    <ContactInfo contact={contact} switchContacts={()=>this.switchContacts(index)} 
                                    key={index}/>
                                )}
                                <AddButton text="Add Contact" onClick={()=>this.setState({showAddContact:true})}/>
                            </>
                        </ExpandableContainer>

                    </div>
                    <div className="contactListItem ps-3 fw-light py-2" 
                    onClick={()=>this.setState({showProfile:true})}>Edit Profile</div>
                    <div className="contactListItem ps-3 fw-light py-2"
                    onClick={()=>this.setState({showTheme:true})}>Change Theme</div>
                    
                    {/*<div className={`contactList c-bg-primary ${ switcher?"":"d-none d-md-block"}`}
                    >
                        <ExpandableContainer text="Rooms">
                            <>
                            {contacts.map((contact,index)=>
                                <RoomInfo contact={contact} switchContacts={()=>this.switchContacts(index)} key={index}/>
                            )}
                            <AddButton text="Add Room"/>
                            </>
                        </ExpandableContainer>
                            </div>*/}
            </SideBar>
           <div className="content c-bg-main" style={{width:'100%'}} id="content" >

           <EmptyScreen hide={clickedContact.id!==undefined}
           showAddContact={()=>{this.setState({showAddContact:true})}}/>
            {clickedContact.id!==undefined &&<div className={`chatSection d-flex flex-column-reverse`} style={{height:'100vh',maxHeight:'100vh',
                    position:'relative'}}id="chat">
                    
    
                    <div className="search" style={{position:'relative'}}>
                            <div className="" style={{width:'100%',maxHeight:'87vh',overflowY:'auto'}}>
                                
                                 <div className="py-1"></div>
                                        <Chat messages={this.state.messages}/>
                                </div>
                        {Object.keys(clickedContact).length>0 && <div className="px-2 pb-2">
                            
                        </div>}
                    <input type="text" name="" id="" className="form-control pe-5" style={{borderRadius:10}}
                            value={value} onChange={(e)=>this.setState({value:e.target.value})} onKeyDown={this._handleKeyDown}/>
                            
                            <span className="material-icons-outlined"style={{position:'absolute',bottom:9,right:15,
                            color:'var(--btn-primary)',cursor:'pointer'}}onClick={this.message} id='sendBtn'>
                            send
                            </span>
                    
                    </div>
                    
                </div>}
            </div>
            </div>
            </div>
            )
    }
}

export default MainPage;