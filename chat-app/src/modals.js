import { Modal,Button } from 'react-bootstrap';
import React from 'react';
import apis from './apis';
class AddContactModal extends React.Component{

    constructor(props){
        super(props);
        this.state={
          email:null,
          invite:null,
          error:null
        }
    }

    addContact=async()=>{
      //handleClose();
      //this.setState({invite:true});
      try {
        await apis.addContact(this.state.email)
        this.props.setContacts()
        this.props.handleClose()
      } catch (error) {
       
            console.log(error.response.status)
            if(error.response.status===400){
              let data  = error.response.data.error_msg
              console.log(data["email"])
              this.setState({error:data["email"]})

        }
      }
      

    }

    render(){
        const {show,handleClose}=this.props;
        const{error}=this.state;
        return(<><Modal data-theme={this.props.theme} show={show} onHide={handleClose} animation={false} centered
        >
        <Modal.Header closeButton  className="c-btn-primary c-text-primary">
          <Modal.Title>Add Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="py-1 formLabel">Email</div>
            <input type="email" className="form-control" placeholder="Enter Email"
            value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} />
            <div className="error">{error===null?"":error}</div>
        </Modal.Body>
        <Modal.Footer>
          <button  className='btn c-btn-danger c-text-primary' onClick={handleClose}>
            Close
          </button>
          <button className='btn c-btn-primary c-text-primary' onClick={this.addContact}>
            Add Contact
          </button>
        </Modal.Footer>
      </Modal>
      <InviteModal show={this.state.invite} handleClose={()=>this.setState({invite:false})}/>
      </>)
    }
}

class ChangeThemeModal extends React.Component{

  constructor(props){
      super(props);
      this.state={
        selected:null,
      }
  }
  changeTheme=(theme)=>{
    this.props.setTheme(theme);
    localStorage.setItem("chat-app-theme",theme)
  }
  render(){
    const {show,handleClose}=this.props;
    return(<Modal data-theme={this.props.theme} show={show} onHide={handleClose} animation={false} centered
    >
    <Modal.Header closeButton  className="c-btn-primary c-text-primary">
      <Modal.Title>Change Theme</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="d-flex justify-content-center" style={{width:'100%'}}>
        <div className="theme-color purple me-3" onClick={()=>this.changeTheme('default')}></div>
        <div className="theme-color green me-3" onClick={()=>this.changeTheme('green')}></div>
        <div className="theme-color blue" onClick={()=>this.changeTheme('blue')}></div>
      </div>
      
    </Modal.Body>
    
    <Modal.Footer>
      <button  className='btn c-btn-danger c-text-primary' onClick={handleClose}>
        Close
      </button>
    </Modal.Footer>
  </Modal>
  )
}
  
}


class InviteModal extends React.Component{

  constructor(props){
      super(props);
      this.state={
        email:null
      }
  }

  render(){
      const {show,handleClose}=this.props;
      return(<><Modal show={show} onHide={handleClose} animation={false} data-theme="default"centered
      >
      <Modal.Header closeButton  className="c-btn-primary c-text-primary">
      </Modal.Header>
      <Modal.Body>
        <div className="py-1 formLabel">
          The email is not Registered. Sent an invite?
          </div>
      </Modal.Body>
      <Modal.Footer>
        <Button  className='c-btn-danger' onClick={handleClose}>
          Close
        </Button>
        <Button className='c-btn-primary' onClick={handleClose}>
          Invite
        </Button>
      </Modal.Footer>
    </Modal></>)
  }
}

export {
  AddContactModal,
  ChangeThemeModal,
}
//export default AddContactModal;