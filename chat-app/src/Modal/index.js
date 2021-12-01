import React, { Component } from 'react'

export default class Modal extends Component {
    render() {
        const {show,onHide}=this.props;
        console.log(this.props.children)
        if(show)
            return (
                <div className="c-modal-overlay">
                    <div className="c-modal-content">
                    {this.props.children.map((child,key)=>
                    <React.Fragment key={key}>
                        {React.cloneElement(child, { onHide })}
                    </React.Fragment>
                    )}
                    </div>
                </div>
            )
        return null
    }
}

export class Title extends Component{
    render(){
        return(
            <h4 className="pt-3 pb-2  flex-grow-1">
                {this.props.children} 
            </h4>
        );
    }
}

export class Header extends Component {
    render() {
        return (
            <div className="c-modal-header c-bg-primary c-text-primary ">
                <div className="d-flex align-items-center mx-3">
                    {this.props.children}
                    <button className="btn btn-ico-2">
                        <span className="material-icons-outlined" onClick={this.props.onHide}>
                                close
                        </span>
                    </button>
                </div>
                
                <div className="c-divide"></div>
            </div>
        )
    }
}


export class Body extends Component {
    render() {
        return (
            <div className="py-3">
               {this.props.children} 
            </div>
        )
    }
}


export  class Footer extends Component {
    render() {
            return (
                <div className="c-modal-footer">
                    <div className="c-divide"></div>
                    <h4 className="pt-3 pb-2 me-4 d-flex flex-row-reverse">
                    {this.props.children} 
                    </h4>
                </div>
        )
    }
}