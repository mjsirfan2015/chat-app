import React from 'react';
import apis from './apis';
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

    componentDidMount = async()=>{
        
        const {name,about}=this.state;
        const user= await (await apis.verifyLogin()).data.data
        if (name===null || about ===null){
            this.setState({name:user.name,about:user.about})
        }
    }

    render(){
        const {user}=this.props;
        const {name,about}=this.state;
        return(
                <div className="sidebar d-flex flex-column align-items-start translator" id ="profile">
                    <div className="profileHeader mb-5" style={{width:'inherit'}}>
                        <div className="d-flex align-items-center px-3"style={{
                            height:'100%',width:'100%'
                        }}>
                            <span className="material-icons-outlined" onClick={this.onBack} style={{'cursor':'pointer'}}>
                            arrow_back
                            </span>
                            <div className="hidableText ms-4 mb-2"style={{fontSize: "25px",height:'30px'}}>Profile</div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center" style={{width:'100%'}}>
                        <img src={user?user.image:Image} alt="profile pic" className="avatar-big " onClick={()=>
                        document.getElementById("fileProfile").click()} style={{'cursor':'pointer'}}/>
                    </div>
                    <div className="mx-4 about">
                         <div className="mt-5 mb-2"style={{}}>Name</div>
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
                         <button className="btn c-btn-secondary c-text-primary mt-3"
                         onClick={()=>this.props.handleUpdate(name,about)}>Update</button>
                    </div>
                   <form id="fileForm">
                       <input hidden type="file" form ="fileForm"name="image" id="fileProfile" onChange={this.props.handleImage}/>
                   </form>
                </div>
            )
    }
}

export default Profile;