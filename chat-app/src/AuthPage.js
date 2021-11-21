import React from 'react';
import apis from './apis';
import Logo from './assets/Bubble-talk.png'
import axios from 'axios'
import { Redirect } from 'react-router';
axios.defaults.baseURL="http://localhost:8000/api"
axios.defaults.withCredentials = true
class AuthPage extends React.Component{

    constructor(props){
        super(props);
        this.state={
          email:null,
          otp:null,
          p1:null,
          show:false,
          btnText:"Login/SignUp with Email",
          redirect:false,
        }
    }

    handleLogin=async()=>{
        const {email,otp,p1}=this.state;
        console.log(email,otp)
        if(p1===null){
            const emaile = document.getElementById("emailLogin");
            emaile.classList.add("no-hide");
            this.setState({p1:false})
            
        }else if(p1===false){
            try {
                let data = await apis.loginEmail(email);
                console.log(data)
                this.setState({btnText:"Continue"})
                const otpe = document.getElementById("otpLogin");
                const emaile = document.getElementById("emailLogin2");
                
                otpe.classList.add("no-hide-x");
                emaile.classList.add('hide-x');
                this.setState({p1:true})
            } catch (error) {
                console.log(error);
            }
            
        }else{
            try {
                let data = await apis.verifyEmail(email,otp);
                await apis.verifyLogin()
                this.setState({redirect:true})
                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }

    }
    componentDidMount = async()=>{
        try {
            let data = await apis.verifyLogin();            
            data = data.data
            console.log(data.data)
            if (data.data.success)this.setState({redirect:true})
        } catch (error) {
            console.log(error)
        }
        
    }
    render(){
        //const {show,handleClose}=this.props;
        const{email,otp,redirect}=this.state;
        //const display=!show?{display:'none'}:{};
        if (redirect)return <Redirect to='/mainPage'/>
        return(
            <div className="d-flex flex-column justify-content-center align-items-center loginPage">
                <img src={Logo} alt="logo" width="100px"/>
                <div className="c-text-primary" style={{fontSize:80}}>Chat-App</div>
                <div className="d-flex hide " id="emailLogin">

                    <form className="d-flex align-items-center justify-content-center" id="emailLogin2">
                        <input type="email"  className="form-control no-hide-x2" placeholder="Enter Email..." 
                        style={{width:'350px',height:'60px'}} value={email} onChange={(e)=>this.setState({email:e.target.value})}/>
                    </form>
                    <div className="hide-x d-flex justify-content-center" id="otpLogin">
                        <input type="text"  className="form-control" placeholder="Enter OTP..." style={{minWidth:'350px',
                        maxWidth:'100%',height:'60px'}}value={otp}onChange={(e)=>this.setState({otp:e.target.value})}/>
                    </div>
            
               </div>
              
            
                <div className="btn c-btn-secondary c-text-primary p-3 my-3 " style={{width:'350px',
            fontSize:20,fontWeight:'medium'}} onClick={this.handleLogin}>{this.state.btnText}</div>

            {/*<div className="btn google-button" style={{width:'350px',
            fontSize:20,fontWeight:'medium'}} ></div>*/}
        </div>
            

        )
    }
}

export default AuthPage;