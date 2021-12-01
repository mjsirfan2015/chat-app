import React from 'react';
import  Modal,{Header,Body,Footer, Title}  from './Modal';
import Image from './assets/Image.webp';

class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state={
            name:null,
            about:null,
        }
    }

    onBack=()=>{
        //console.log("hello")
        const profile = document.getElementById("profile");
        profile.classList.add('translator')
    }

    componentDidUpdate = ()=>{
        
        const {name,about}=this.state;
        const {user}=this.props; //await (await apis.verifyLogin()).data.data
        if ((name===null || about ===null) && user!=null){
            this.setState({name:user.name,about:user.about,image:user.image})
        }
    }

    handleImage = async()=>{
        await this.props.handleImage();
        this.setState({image:this.props.user.image})
    }

    render(){
        const {show,handleClose}=this.props;
        const {name,about,image}=this.state;
        console.log(this.props.handleImage)
        return(
            <div>
                <Modal show={show}
                onHide={handleClose}
      >
      <Header>
        <Title>Edit/View Profile</Title>
      </Header>
      <Body>
                <div className="d-flex flex-column my-2" id ="profile"
                >
                    <div className="d-flex justify-content-center" style={{width:'100%'}}>
                    <img src={(image)?image:Image} alt="profile pic" className="avatar-big " onClick={()=>
                        document.getElementById("fileProfile").click()} style={{'cursor':'pointer'}}/>
                    </div>
                    <div className="mx-4 about">
                         <div className="mt-3 mb-2"style={{}}>Name</div>
                         <div className="d-flex">
                             <input type="text" className="textbox" value={name===null?"":name}
                             onChange={(e)=>this.setState({name:e.target.value})}/>
                             {/*<span className="material-icons-outlined">
                                edit
                    </span>*/}
                         </div>
                         
                         <div className="mt-3 mb-3">About</div>
                         <div className="d-flex">
                            <textarea type="text" className="textbox"  rows={1}
                            value={about===null?"":about}
                            onChange={(e)=>this.setState({about:e.target.value})}/>
                            {/*<span className="material-icons-outlined">
                                edit
                </span>*/}
                         </div>
                         
                    </div>
                   <form id="fileForm">
                       <input hidden type="file" form ="fileForm"name="image" id="fileProfile" onChange={this.handleImage}/>
                   </form>
                </div>
                </Body>
                <Footer>
                    <button className="btn c-btn-secondary c-text-primary ms-2"
                         onClick={()=>this.props.handleUpdate(name,about)}>Update</button>
                    <button className="btn c-btn-danger c-text-primary" onClick={handleClose}>Close</button>
                </Footer>
            </Modal>
            </div>
            )
    }
}

export default Profile;