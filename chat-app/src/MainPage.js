import React from 'react';
import Profile from './Profile';
import {AddContactModal, ChangeThemeModal} from './modals';
import apis from './apis';
import { Redirect } from 'react-router';
import { io } from "socket.io-client";
import {  ContactInfo, ExpandableContainer } from './contacts/contacts';
import Chat from './chats/chats';
import { Button } from '@material-ui/core';
import { Box, IconButton,Typography,Drawer,AppBar,Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const NavBar = function({setSwitch}){
    const [side, setSide] = React.useState(true)
    
    document.addEventListener('click',(e)=>{
        const element1 = document.getElementById('content');
        //console.log(element)(element.contains(e.target))
        if(element1&&(element1.contains(e.target))){
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
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
            <IconButton aria-label="menu" onClick={setSwitch}>
                <MenuIcon sx={{color:"text.secondary"}}/>
            </IconButton>
            <Typography variant='body' sx={{color:'text.secondary'}} mx={1}>
                Chat-App
            </Typography>
        </Toolbar>
        </AppBar>
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
            <span className="material-icons"style={{fontSize:128}}>
                people_alt
            </span>
            <button className="btn c-btn-primary c-text-primary d-flex align-items-center"
            onClick={showAddContact}>
                <span className="material-icons">
                    add
                </span>
                
                Add Contacts
            </button>
            {/*<button className="btn c-btn-primary c-text-primary d-flex align-items-center mt-2">
                <span className="material-icons">
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
        this.refMain=React.createRef();
    }  
    
    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          const btn = document.getElementById('sendBtn');
          btn.click();
        }
      }

      switchContacts = async(i)=>{
          let data  = await apis.viewChats(this.state.contacts[i].room)
          this.setState({clickedContact:this.state.contacts[i],messages:data.data.data})
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
            showProfile,showTheme,switcher}=this.state;
        const {theme,setTheme}=this.props;
        //if (redirect)return <Redirect to='/'/>
        return(
            <Box sx={{display:'flex',flexDirection:'column'}}>
                <NavBar setSwitch={()=>this.setState({switcher:!switcher})}/>
                <Box ref={this.refMain}>

                </Box>
                <Drawer
                    BackdropProps={{ invisible: true }}
                    variant="permanant"
                    open={switcher}
                    onClose={()=>this.setState({switcher:false})}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
          sx={{
            //display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '300px' ,
            backgroundColor:'primary.main'
            },
            
          }}
        >
          <ExpandButton/>
        </Drawer>
            </Box>
           
       
            )
    }
}

export default MainPage;