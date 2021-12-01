import React, { Component } from 'react'

export default class Modal extends Component {
    render() {
        const {show,onHide}=this.props;
        if(show)
            return (
                <div className="c-modal-overlay">
                    <div className="c-modal-content">
                        {this.props.children}
                    </div>
                </div>
            )
        return null
    }
}

export  class Header extends Component {
    render() {
        return (
            <div className="c-modal-header c-bg-primary c-text-primary">
                <h4 class="pt-3 pb-2 ms-3">
                {this.props.children} 
                </h4>
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
                    <h4 class="pt-3 pb-2 me-4 d-flex flex-row-reverse">
                    {this.props.children} 
                    </h4>
                </div>
        )
    }
}